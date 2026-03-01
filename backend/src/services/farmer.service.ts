import { pool } from '../db/neon.connection';
import { AppError } from '../middlewares/errorHandler';
import { Farmer } from '../types';
import { CreateFarmerInput, UpdateFarmerInput } from '../validators/farmer';

export const getFarmers = async (): Promise<Farmer[]> => {
    try {
        // Ensure farmers table exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS farmers (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL,
                location TEXT,
                latitude DECIMAL,
                longitude DECIMAL,
                crops TEXT[] DEFAULT '{}',
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        const res = await pool.query('SELECT * FROM farmers ORDER BY created_at DESC');
        return res.rows;
    } catch (error: any) {
        console.error('[DB] getFarmers error:', error);
        throw new AppError(500, 'Failed to fetch farmers from database');
    }
};

export const getFarmerById = async (id: string): Promise<Farmer> => {
    try {
        const res = await pool.query('SELECT * FROM farmers WHERE id = $1', [id]);
        const farmer = res.rows[0];

        if (!farmer) {
            throw new AppError(404, 'Farmer not found');
        }

        return farmer;
    } catch (error: any) {
        if (error instanceof AppError) throw error;
        console.error(`[DB] getFarmerById error (ID: ${id}):`, error);
        throw new AppError(500, 'Failed to fetch farmer details');
    }
};

export const createFarmer = async (input: CreateFarmerInput): Promise<Farmer> => {
    try {
        const res = await pool.query(
            'INSERT INTO farmers (name, location, latitude, longitude, crops) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [input.name, input.location, input.latitude, input.longitude, input.crops]
        );
        return res.rows[0];
    } catch (_error: any) {
        console.error('Database Error in createFarmer:', _error);
        throw new AppError(500, 'Failed to create farmer');
    }
};

export const updateFarmer = async (id: string, input: UpdateFarmerInput): Promise<Farmer> => {
    await getFarmerById(id);

    try {
        const res = await pool.query(
            'UPDATE farmers SET name = $1, location = $2, latitude = $3, longitude = $4, crops = $5 WHERE id = $6 RETURNING *',
            [input.name, input.location, input.latitude, input.longitude, input.crops, id]
        );
        return res.rows[0];
    } catch (_error: any) {
        console.error('Database Error in updateFarmer:', _error);
        throw new AppError(500, 'Failed to update farmer');
    }
};

export const deleteFarmer = async (id: string): Promise<void> => {
    await getFarmerById(id);
    try {
        await pool.query('DELETE FROM farmers WHERE id = $1', [id]);
    } catch (_error: any) {
        console.error('Database Error in deleteFarmer:', _error);
        throw new AppError(500, 'Failed to delete farmer');
    }
};
