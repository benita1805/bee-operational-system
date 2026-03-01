import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const errorHandler = (
    err: Error | AppError | ZodError | SyntaxError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // JSON parsing errors
    if ((err instanceof SyntaxError && 'body' in err) || (err as any).type === 'entity.parse.failed') {
        res.status(400).json({
            success: false,
            error: 'Invalid JSON payload',
        });
        return;
    }

    // Zod validation errors
    if (err instanceof ZodError) {
        res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: err.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
        return;
    }

    // Custom application errors
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
        return;
    }

    // Log unexpected errors
    console.error('Unexpected error:', err);
    if (err instanceof Error) {
        console.error('Stack trace:', err.stack);
    }

    // Generic error response
    res.status(500).json({
        success: false,
        error: 'Internal server error',
    });
};

// Async handler wrapper to catch promise rejections
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
