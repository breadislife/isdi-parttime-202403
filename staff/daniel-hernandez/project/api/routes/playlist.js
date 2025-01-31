import express from 'express';
import handlers from '../handlers/index.js';
const router = express.Router();

router.route('/:playlistId').get(handlers.getPlaylistInfoHandler);

export default router;
