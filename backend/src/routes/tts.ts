import { Router } from 'express';
import {
  deleteCacheHandler,
  getCacheStatsHandler,
  postSynthesize,
} from '../controllers/ttsController';
import { getStaticPackByGradeHandler } from '../controllers/staticPackProxyController';

const router = Router();

router.post('/tts/synthesize', postSynthesize);
router.get('/tts/cache-stats', getCacheStatsHandler);
router.delete('/tts/cache', deleteCacheHandler);
router.get('/tts/static-pack/by-grade/:grade', getStaticPackByGradeHandler);

export default router;
