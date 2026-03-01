import { Router } from 'express';
import { floweringForecast } from '../controllers/map.controller';

const router = Router();

router.get('/flowering-forecast', floweringForecast);

export default router;
