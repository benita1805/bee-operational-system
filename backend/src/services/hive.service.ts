import { pool } from '../db/neon.connection';
import { AppError } from '../middlewares/errorHandler';
import { Hive } from '../types';
import { CreateHiveInput, SyncHivesInput, UpdateHiveInput } from '../validators/hive';

export const getHives = async (userId: string): Promise<Hive[]> => {
    try {
        // Ensure hives table exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS hives (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES users(id),
                title TEXT NOT NULL,
                farmer_name TEXT,
                field_location TEXT,
                placement_date TIMESTAMP,
                expected_harvest_date TIMESTAMP,
                status TEXT DEFAULT 'ACTIVE',
                notes TEXT,
                media_urls TEXT[] DEFAULT '{}',
                last_synced_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        const res = await pool.query('SELECT * FROM hives WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        return res.rows;
    } catch (error: any) {
        console.error(`[DB] getHives error for user ${userId}:`, error);
        throw new AppError(500, 'Failed to fetch hives from database');
    }
};

export const getHiveById = async (id: string, userId: string): Promise<Hive> => {
    try {
        const res = await pool.query('SELECT * FROM hives WHERE id = $1 AND user_id = $2', [id, userId]);
        const hive = res.rows[0];

        if (!hive) {
            throw new AppError(404, 'Hive not found');
        }

        return hive;
    } catch (error: any) {
        if (error instanceof AppError) throw error;
        console.error(`[DB] getHiveById error:`, error);
        throw new AppError(500, 'Failed to fetch hive details');
    }
};

export const createHive = async (userId: string, input: CreateHiveInput): Promise<Hive> => {
    try {
        const res = await pool.query(
            `INSERT INTO hives (user_id, title, farmer_name, field_location, placement_date, expected_harvest_date, status, notes, media_urls, last_synced_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [
                userId,
                input.title,
                input.farmer_name,
                input.field_location,
                input.placement_date,
                input.expected_harvest_date,
                input.status || 'ACTIVE',
                input.notes,
                input.media_urls || [],
                new Date().toISOString()
            ]
        );
        return res.rows[0];
    } catch (error: any) {
        console.error(`[DB] createHive error:`, error);
        throw new AppError(500, 'Failed to create hive in database');
    }
};

export const updateHive = async (
    id: string,
    userId: string,
    input: UpdateHiveInput
): Promise<Hive> => {
    await getHiveById(id, userId);

    try {
        const res = await pool.query(
            `UPDATE hives SET 
                title = COALESCE($1, title),
                farmer_name = COALESCE($2, farmer_name),
                field_location = COALESCE($3, field_location),
                placement_date = COALESCE($4, placement_date),
                expected_harvest_date = COALESCE($5, expected_harvest_date),
                status = COALESCE($6, status),
                notes = COALESCE($7, notes),
                media_urls = COALESCE($8, media_urls),
                last_synced_at = $9,
                updated_at = NOW()
             WHERE id = $10 AND user_id = $11 RETURNING *`,
            [
                input.title,
                input.farmer_name,
                input.field_location,
                input.placement_date,
                input.expected_harvest_date,
                input.status,
                input.notes,
                input.media_urls,
                new Date().toISOString(),
                id,
                userId
            ]
        );
        return res.rows[0];
    } catch (_error: any) {
        console.error('Database Error in updateHive:', _error);
        throw new AppError(500, 'Failed to update hive');
    }
};

export const deleteHive = async (id: string, userId: string): Promise<void> => {
    await getHiveById(id, userId);
    try {
        await pool.query('DELETE FROM hives WHERE id = $1 AND user_id = $2', [id, userId]);
    } catch (_error: any) {
        console.error('Database Error in deleteHive:', _error);
        throw new AppError(500, 'Failed to delete hive');
    }
};

export const syncHives = async (
    userId: string,
    input: SyncHivesInput
): Promise<{ synced: Hive[]; conflicts: any[] }> => {
    const synced: Hive[] = [];
    const conflicts: any[] = [];

    for (const hiveData of input.hives) {
        try {
            if (hiveData.id) {
                const existingRes = await pool.query('SELECT * FROM hives WHERE id = $1 AND user_id = $2', [hiveData.id, userId]);
                const existing = existingRes.rows[0];

                if (existing) {
                    const serverUpdated = new Date(existing.updated_at);
                    const clientUpdated = new Date(hiveData.updated_at);

                    if (clientUpdated >= serverUpdated) {
                        const { title, farmer_name, field_location, placement_date, expected_harvest_date, status, notes, media_urls } = hiveData;
                        const updated = await updateHive(hiveData.id, userId, { title, farmer_name, field_location, placement_date, expected_harvest_date, status, notes, media_urls } as UpdateHiveInput);
                        synced.push(updated);
                    } else {
                        conflicts.push({
                            id: hiveData.id,
                            reason: 'Server version is newer',
                            server_updated_at: existing.updated_at,
                            client_updated_at: hiveData.updated_at,
                        });
                    }
                } else {
                    // Create with provided ID
                    const res = await pool.query(
                        `INSERT INTO hives (id, user_id, title, farmer_name, field_location, placement_date, expected_harvest_date, status, notes, media_urls, last_synced_at) 
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
                        [
                            hiveData.id,
                            userId,
                            hiveData.title,
                            hiveData.farmer_name,
                            hiveData.field_location,
                            hiveData.placement_date,
                            hiveData.expected_harvest_date,
                            hiveData.status || 'ACTIVE',
                            hiveData.notes,
                            hiveData.media_urls || [],
                            new Date().toISOString()
                        ]
                    );
                    synced.push(res.rows[0]);
                }
            } else {
                const { title, farmer_name, field_location, placement_date, expected_harvest_date, status, notes } = hiveData;
                const created = await createHive(userId, { title, farmer_name, field_location, placement_date, expected_harvest_date, status, notes } as CreateHiveInput);
                synced.push(created);
            }
        } catch (_error) {
            console.error('Sync error for hive:', _error);
        }
    }

    return { synced, conflicts };
};

export const addMediaToHive = async (
    id: string,
    userId: string,
    mediaUrl: string
): Promise<Hive> => {
    const hive = await getHiveById(id, userId);

    const updatedMediaUrls = [...(hive.media_urls || []), mediaUrl];

    const res = await pool.query(
        'UPDATE hives SET media_urls = $1, last_synced_at = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING *',
        [updatedMediaUrls, new Date().toISOString(), id, userId]
    );
    return res.rows[0];
};
