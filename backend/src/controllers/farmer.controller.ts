import { Request, Response } from 'express';
import * as farmerService from '../services/farmer.service';
import { asyncHandler } from '../middlewares/errorHandler';
import { CreateFarmerInput, UpdateFarmerInput } from '../validators/farmer';

export class FarmerController {
    getFarmers = asyncHandler(async (_req: Request, res: Response) => {
        const farmers = await farmerService.getFarmers();

        res.status(200).json({
            success: true,
            data: farmers,
        });
    });

    getFarmer = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const farmer = await farmerService.getFarmerById(id);

        res.status(200).json({
            success: true,
            data: farmer,
        });
    });

    createFarmer = asyncHandler(async (req: Request, res: Response) => {
        const input = req.body as CreateFarmerInput;

        const farmer = await farmerService.createFarmer(input);

        res.status(201).json({
            success: true,
            data: farmer,
        });
    });

    updateFarmer = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const input = req.body as UpdateFarmerInput;

        const farmer = await farmerService.updateFarmer(id, input);

        res.status(200).json({
            success: true,
            data: farmer,
        });
    });

    deleteFarmer = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        await farmerService.deleteFarmer(id);

        res.status(200).json({
            success: true,
            message: 'Farmer deleted successfully',
        });
    });
}

export const farmerController = new FarmerController();
