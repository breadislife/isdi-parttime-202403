import express from 'express';
import hanlders from '../handlers/index.js';
const router = express.Router();

router.route('/recent').get(hanlders.getRecentPlaysHandler);

export default router;
