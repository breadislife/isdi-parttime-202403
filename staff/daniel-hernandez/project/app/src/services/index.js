import signIn from './auth/signIn';
import signUp from './auth/signUp';
import signOut from './auth/signOut';
import checkEmail from './auth/checkEmail';

import search from './search';
import { storage } from './storage.js';

import { playback } from './playback';
import player from './player.js';

import followUser from './user/followUser.js';

export { signIn, signUp, signOut, checkEmail, search, storage, playback, player, followUser };

export default {
   signIn,
   signUp,
   signOut,
   checkEmail,
   search,
   storage,
   playback,
   player,
   followUser
};
