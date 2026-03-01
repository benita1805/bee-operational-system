import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middlewares/errorHandler';

// Routes
import authRoutes from './routes/auth.routes';
import hiveRoutes from './routes/hive.routes';
import farmerRoutes from './routes/farmer.routes';
import mapRoutes from './routes/map.routes';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

// Health check endpoint
app.get('/health', (_req: Request, res: Response): void => {
    res.status(200).json({
        success: true,
        message: 'Buzz-Off API is running',
        timestamp: new Date().toISOString(),
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/hives', hiveRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/map', mapRoutes);
app.use('/map', mapRoutes);

// 404 handler
app.use((_req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
