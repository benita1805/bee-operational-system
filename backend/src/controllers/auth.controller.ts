import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler';
import { authService } from '../services/auth.service';

export class AuthController {
    requestOTP = asyncHandler(async (req: Request, res: Response) => {
        const { phone } = req.body;

        try {
            const result = await authService.requestOTP(phone);
            res.status(200).json({
                success: true,
                ...result,
            });
        } catch (error: any) {
            console.error(`[ERROR] requestOTP failed:`, error);
            throw error;
        }
    });

    verifyOTP = asyncHandler(async (req: Request, res: Response) => {
        const { phone, otp } = req.body;

        const result = await authService.verifyOTP(phone, otp);

        res.status(200).json({
            success: true,
            data: result,
        });
    });
}

export const authController = new AuthController();
