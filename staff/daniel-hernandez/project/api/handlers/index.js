import loginHandler from './auth/login.js';
import registerHandler from './auth/register.js';
import checkEmailHandler from './auth/checkEmail.js';

import logHandler from './log.js';
import queryHandler from './query.js';

import streamHandler from './stream.js';
import playerHandler from './player.js';

import followUserHandler from './user/followUser.js';
import getUserInfoHandler from './user/getUserInfo.js';

export default {
   loginHandler,
   registerHandler,
   checkEmailHandler,

   logHandler,
   queryHandler,

   streamHandler,
   playerHandler,

   followUserHandler,
   getUserInfoHandler
};
