/**
 * Migration: Add latitude and longitude columns to the farmers table.
 * Safe: Uses IF NOT EXISTS pattern via a DO block, so it won't fail
 * if the columns already exist and won't delete any existing data.
 */
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('Connected to Neon PostgreSQL.');

        // Check current columns first
        const cols = await client.query(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'farmers' ORDER BY ordinal_position"
        );
        console.log('\nCurrent farmers columns:');
        cols.rows.forEach(r => console.log(`  - ${r.column_name} (${r.data_type})`));

        // Safely add columns if they don't exist
        await client.query(`
            ALTER TABLE farmers
            ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
            ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
        `);
        console.log('\n✅ latitude and longitude columns ensured on farmers table.');

        // Verify
        const after = await client.query(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'farmers' ORDER BY ordinal_position"
        );
        console.log('\nUpdated farmers columns:');
        after.rows.forEach(r => console.log(`  - ${r.column_name} (${r.data_type})`));

    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
