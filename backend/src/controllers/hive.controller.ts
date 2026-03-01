import { Request, Response } from 'express';
import multer from 'multer';
import * as hiveService from '../services/hive.service';
import { storageService } from '../services/storage.service';
import { asyncHandler } from '../middlewares/errorHandler';
import { CreateHiveInput, UpdateHiveInput, SyncHivesInput } from '../validators/hive';

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

export class HiveController {
    getHives = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;

        const hives = await hiveService.getHives(userId);

        res.status(200).json({
            success: true,
            data: hives,
        });
    });

    getHive = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.user!.userId;

        const hive = await hiveService.getHiveById(id, userId);

        res.status(200).json({
            success: true,
            data: hive,
        });
    });

    createHive = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const input = req.body as CreateHiveInput;

        const hive = await hiveService.createHive(userId, input);

        res.status(201).json({
            success: true,
            data: hive,
        });
    });

    updateHive = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.user!.userId;
        const input = req.body as UpdateHiveInput;

        const hive = await hiveService.updateHive(id, userId, input);

        res.status(200).json({
            success: true,
            data: hive,
        });
    });

    deleteHive = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.user!.userId;

        await hiveService.deleteHive(id, userId);

        res.status(200).json({
            success: true,
            message: 'Hive deleted successfully',
        });
    });

    syncHives = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const input = req.body as SyncHivesInput;

        const result = await hiveService.syncHives(userId, input);

        res.status(200).json({
            success: true,
            data: result,
        });
    });

    uploadMedia = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.user!.userId;
        const file = req.file;

        if (!file) {
            res.status(400).json({
                success: false,
                error: 'No file uploaded',
            });
            return;
        }

        const mediaUrl = await storageService.uploadFile(file, userId);
        const hive = await hiveService.addMediaToHive(id, userId, mediaUrl);

        res.status(200).json({
            success: true,
            data: {
                hive,
                mediaUrl,
            },
        });
    });
}

export const hiveController = new HiveController();
export const uploadMiddleware = upload.single('file');
