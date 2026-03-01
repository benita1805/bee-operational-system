import { z } from 'zod';

export const createFarmerSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required').max(200),
        location: z.string().optional(),
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
        crops: z.array(z.string()).default([]),
    }),
});

export const updateFarmerSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid farmer ID'),
    }),
    body: z.object({
        name: z.string().min(1).max(200).optional(),
        location: z.string().optional(),
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
        crops: z.array(z.string()).optional(),
    }),
});

export type CreateFarmerInput = z.infer<typeof createFarmerSchema>['body'];
export type UpdateFarmerInput = z.infer<typeof updateFarmerSchema>['body'];
