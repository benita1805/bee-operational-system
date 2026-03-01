import { NextFunction, Request, Response } from 'express';
import { findUserById } from '../services/user.service';
import { JWTPayload } from '../types';
import { verifyToken } from '../utils/jwt';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
            userId?: string;
        }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: 'No token provided',
            });
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        const decoded = verifyToken(token);
        req.user = decoded;

        try {
            // Verify user exists in Neon
            const dbUser = await findUserById(decoded.userId);

            if (!dbUser) {
                res.status(401).json({
                    success: false,
                    error: 'User not found in database',
                });
                return;
            }

            req.userId = dbUser.id;
        } catch (error) {
            console.error(`[AUTH] Database check failed for user ${decoded.userId}:`, error);
            res.status(401).json({
                success: false,
                error: 'Authentication failed due to database error',
            });
            return;
        }

        next();
    } catch (_error) {
        res.status(401).json({
            success: false,
            error: 'Invalid or expired token',
        });
    }
};
