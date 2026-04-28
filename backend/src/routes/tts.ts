import { Router } from 'express';
import {
  deleteCacheHandler,
  getCacheStatsHandler,
  getStaticPackByGradeHandler,
  postSynthesize,
} from '../controllers/ttsController';

const router = Router();

router.post('/tts/synthesize', postSynthesize);
router.get('/tts/cache-stats', getCacheStatsHandler);
router.delete('/tts/cache', deleteCacheHandler);
router.get('/tts/static-pack/by-grade/:grade', getStaticPackByGradeHandler);

export default router;
