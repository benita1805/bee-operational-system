import { Request, Response } from 'express';
import { getFloweringForecast, generateGridPoints } from '../services/aiMap.service';
import { asyncHandler } from '../middlewares/errorHandler';

export const floweringForecast = asyncHandler(async (req: Request, res: Response) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        res.status(400).json({
            success: false,
            error: 'Latitude and longitude are required'
        });
        return;
    }

    const gridPoints = generateGridPoints(Number(lat), Number(lng));

    // Fetch forecast for all 25 points in parallel
    const forecastPromises = gridPoints.map(point =>
        getFloweringForecast(point.lat, point.lng)
    );

    const results = await Promise.all(forecastPromises);

    console.log('FLOWERING DEBUG:', results);

    res.json(results);
});
