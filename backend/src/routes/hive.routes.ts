import { Router } from 'express';
import { hiveController, uploadMiddleware } from '../controllers/hive.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
    createHiveSchema,
    updateHiveSchema,
    getHiveSchema,
    syncHivesSchema,
} from '../validators/hive';

const router = Router();

// All hive routes require authentication
router.use(authenticate);

router.get('/', hiveController.getHives);
router.get('/:id', validate(getHiveSchema), hiveController.getHive);
router.post('/', validate(createHiveSchema), hiveController.createHive);
router.patch('/:id', validate(updateHiveSchema), hiveController.updateHive);
router.delete('/:id', validate(getHiveSchema), hiveController.deleteHive);
router.post('/sync', validate(syncHivesSchema), hiveController.syncHives);
router.post('/:id/upload', validate(getHiveSchema), uploadMiddleware, hiveController.uploadMedia);

export default router;
