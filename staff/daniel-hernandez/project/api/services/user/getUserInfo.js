import { User, Track, Album, Playlist } from '../../data/index.js';
import { CredentialError, NotFoundError, SystemError } from 'com/errors.js';
import transformDocument from '../../utils/transformDocument.js';
import validate from 'com/validation.js';
import constants from 'com/constants.js';
import log from '../log.js';

const getUserInfo = (userId, targetUserId) => {
   validate.inputs(userId, targetUserId);
   validate.objectId(userId);
   validate.objectId(targetUserId);

   return (async () => {
      let user, targetUserInfo, popularTracks, recentTracks, albums, playlists;

      try {
         user = await User.findById(userId).lean();
      } catch (error) {
         throw new SystemError(`Fetching user info failed: ${error.message}`);
      }

      if (!user) {
         throw new CredentialError("User doesn't exist");
      }

      try {
         targetUserInfo = await User.aggregate([{ $match: { _id: targetUserId } }, { $project: { username: 1, followers: { $size: '$followers' }, following: { $size: '$following' } } }]);
      } catch (error) {
         throw new SystemError(`Fetching user info failed: ${error.message}`);
      }

      if (!targetUserInfo.length) {
         throw new NotFoundError("Target user doesn't exist");
      }

      try {
         [popularTracks, recentTracks, albums, playlists] = await Promise.all([
            // Gets popular tracks based on play logs
            Track.aggregate([
               { $lookup: { from: 'logs', localField: '_id', foreignField: 'track', pipeline: [{ $match: { type: constants.PLAYED_TRACK } }], as: 'trackLogs' } },
               { $unwind: { path: '$trackLogs' } },
               { $group: { _id: '$_id', name: { $first: '$name' }, artists: { $first: '$artists' }, plays: { $sum: 1 }, duration: { $first: '$duration' }, coverArt: { $first: '$coverArt' }, album: { $first: '$album' } } },
               { $sort: { plays: -1 } },
               { $limit: 10 },
               { $project: { name: 1, artists: { $map: { input: '$artists', as: 'artist', in: { _id: '$$artist._id', name: '$$artist.name' } } }, plays: 1, duration: 1, coverArt: 1, album: { _id: 1, name: 1 } } }
            ]),

            // Gets recent tracks added or performed by the target user
            Track.aggregate([
               { $match: { $or: [{ addedBy: targetUserId },
               { artists: targetUserId }] } },
               { $sort: { createdAt: -1 } },
               { $limit: 5 },
               { $project: { name: 1, artists: { _id: 1, name: 1 }, duration: 1, album: { _id: 1, name: 1 }, coverArt: 1 } }
            ]),

            // Gets albums created by the target user
            Album.aggregate([
               { $match: { artists: targetUserId } },
               { $limit: 10 },
               { $project: { name: 1, artists: { _id: 1, username: 1 }, coverArt: 1 } }
            ]),

            // Gets the playlists owned by the target user
            Playlist.aggregate([
               { $match: { owner: targetUserId, public: true } },
               { $lookup: { from: 'tracks', localField: 'tracks', foreignField: '_id', as: 'trackDetails' } },
               { $addFields: { duration: { $sum: '$trackDetails.duration' }, trackCount: { $size: '$tracks' } } },
               { $sort: { followers: -1 } },
               { $limit: 10 },
               { $project: { name: 1, owner: { _id: 1, username: 1 }, coverArt: 1, followers: 1, tracks: '$trackCount', duration: 1 } }
            ])
         ]);
      } catch (error) {
         throw new SystemError(`Fetching user info failed: ${error.message}`);
      }

      targetUserInfo = targetUserInfo.map(transformDocument);
      popularTracks = popularTracks.map(transformDocument);
      recentTracks = recentTracks.map(transformDocument);
      albums = albums.map(transformDocument);
      playlists = playlists.map(transformDocument);

      try {
         await log(userId, constants.VIEWED_USER_PROFILE, targetUserId, constants.types[0]);
      } catch (error) {
         throw new SystemError(`Fetching user info failed: ${error.message}`);
      }

      return {
         ...targetUserInfo,
         tracks: {
            popular: popularTracks,
            recent: recentTracks
         },
         albums,
         playlists
      };
   })();
};

export default getUserInfo;
