import { Router } from 'express';
import { farmerController } from '../controllers/farmer.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createFarmerSchema, updateFarmerSchema } from '../validators/farmer';

const router = Router();

// All farmer routes require authentication
router.use(authenticate);

router.get('/', farmerController.getFarmers);
router.get('/:id', farmerController.getFarmer);
router.post('/', validate(createFarmerSchema), farmerController.createFarmer);
router.patch('/:id', validate(updateFarmerSchema), farmerController.updateFarmer);
router.delete('/:id', farmerController.deleteFarmer);

export default router;
