import login from './auth/login.js';
import register from './auth/register.js';
import checkEmail from './auth/checkEmail.js';
import log from './log.js';
import stream from './stream.js';
import query from './query.js';
import player from './player.js';
import followUser from './user/followUser.js';
import getUserInfo from './user/getUserInfo.js';
import getPlaylistInfo from './playlist/getPlaylistInfo.js';
import getAlbumInfo from './album/getAlbumInfo.js';

export default {
   login,
   register,
   checkEmail,
   log,
   stream,
   query,
   player,
   followUser,
   getUserInfo,
   getPlaylistInfo,
   getAlbumInfo
};
