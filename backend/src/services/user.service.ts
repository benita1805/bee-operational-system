import { pool } from '../db/neon.connection';

export const findUserById = async (userId: string) => {
    const result = await pool.query(
        'SELECT id, phone FROM users WHERE id = $1',
        [userId]
    );
    return result.rows[0];
};
