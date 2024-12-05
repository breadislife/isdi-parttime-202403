import { User } from '../../data/index.js';
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
      let user, targetUser;

      try {
         user = await User.findById(userId).lean();
      } catch (error) {
         throw new SystemError(`Fetching user info failed: ${error.message}`);
      }

      if (!user) {
         throw new CredentialError("User doesn't exist");
      }

      try {
         targetUser = await User.findById(targetUserId).select('username bio profileImage followers following likedTracks likedAlbums followingPlaylists').lean();
      } catch (error) {
         throw new SystemError(`Fetching user info failed: ${error.message}`);
      }

      if (!targetUser) {
         throw new NotFoundError("Target user doesn't exist");
      }

      try {
         await log(userId, constants.VIEWED_USER_PROFILE, targetUserId, constants.types[0]);
      } catch (error) {
         throw new SystemError(`Fetching user info failed: ${error.message}`);
      }

      return transformDocument(targetUser);
   })();
};

export default getUserInfo;
