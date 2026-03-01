import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { requestOTPSchema, verifyOTPSchema } from '../validators/auth';

const router = Router();

router.post('/request-otp', validate(requestOTPSchema), authController.requestOTP);
router.post('/verify-otp', validate(verifyOTPSchema), authController.verifyOTP);

export default router;
