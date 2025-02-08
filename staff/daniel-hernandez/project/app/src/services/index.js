import signIn from './auth/signIn';
import signUp from './auth/signUp';
import signOut from './auth/signOut';
import checkEmail from './auth/checkEmail';

import search from './search';
import { storage } from './storage';

import { playback } from './playback';
import player from './player';

import followUser from './user/followUser';
import getUserInfo from './user/getUserInfo';

import getPlaylistInfo from './playlist/getPlaylistInfo';
import followPlaylist from './playlist/followPlaylist';

import getAlbumInfo from './album/getAlbumInfo';

export { signIn, signUp, signOut, checkEmail, search, storage, playback, player, followUser, getUserInfo, getPlaylistInfo, followPlaylist, getAlbumInfo };

export default {
   signIn,
   signUp,
   signOut,
   checkEmail,

   search,
   storage,

   playback,
   player,

   followUser,
   getUserInfo,

   getPlaylistInfo,
   followPlaylist,

   getAlbumInfo
};
