import express from 'express';
import handlers from '../handlers/index.js';
const router = express.Router();

router.route('/').post(handlers.playerHandler);

export default router;