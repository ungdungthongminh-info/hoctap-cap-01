import { Router } from 'express';
import { deleteCacheHandler, getCacheStatsHandler, postSynthesize } from '../controllers/ttsController';

const router = Router();

router.post('/tts/synthesize', postSynthesize);
router.get('/tts/cache-stats', getCacheStatsHandler);
router.delete('/tts/cache', deleteCacheHandler);

export default router;
