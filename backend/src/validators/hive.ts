import { z } from 'zod';

const hiveStatusEnum = z.enum(['ACTIVE', 'HARVESTED', 'RELOCATED']);

export const createHiveSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required').max(200),
        farmer_name: z.string().optional(),
        field_location: z.string().optional(),
        placement_date: z.string().datetime().optional(),
        expected_harvest_date: z.string().datetime().optional(),
        status: hiveStatusEnum.default('ACTIVE'),
        notes: z.string().optional(),
        media_urls: z.array(z.string()).optional(),
    }),
});

export const updateHiveSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid hive ID'),
    }),
    body: z.object({
        title: z.string().min(1).max(200).optional(),
        farmer_name: z.string().optional(),
        field_location: z.string().optional(),
        placement_date: z.string().datetime().optional(),
        expected_harvest_date: z.string().datetime().optional(),
        status: hiveStatusEnum.optional(),
        notes: z.string().optional(),
        media_urls: z.array(z.string()).optional(),
        last_synced_at: z.string().datetime().optional(),
    }),
});

export const getHiveSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid hive ID'),
    }),
});

export const syncHivesSchema = z.object({
    body: z.object({
        hives: z.array(
            z.object({
                id: z.string().uuid().optional(),
                title: z.string().min(1).max(200),
                farmer_name: z.string().optional(),
                field_location: z.string().optional(),
                placement_date: z.string().datetime().optional(),
                expected_harvest_date: z.string().datetime().optional(),
                status: hiveStatusEnum.default('ACTIVE'),
                notes: z.string().optional(),
                media_urls: z.array(z.string()).optional(),
                updated_at: z.string().datetime(),
            })
        ),
        last_synced_at: z.string().datetime(),
    }),
});

export type CreateHiveInput = z.infer<typeof createHiveSchema>['body'];
export type UpdateHiveInput = z.infer<typeof updateHiveSchema>['body'];
export type SyncHivesInput = z.infer<typeof syncHivesSchema>['body'];
