require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function verify() {
    try {
        const r = await pool.query(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'farmers' ORDER BY ordinal_position"
        );
        const lines = r.rows.map(c => c.column_name + ' | ' + c.data_type);
        console.log('FARMERS_COLUMNS_START');
        lines.forEach(l => console.log(l));
        console.log('FARMERS_COLUMNS_END');

        const hasLat = r.rows.some(c => c.column_name === 'latitude');
        const hasLng = r.rows.some(c => c.column_name === 'longitude');
        console.log('HAS_LATITUDE=' + hasLat);
        console.log('HAS_LONGITUDE=' + hasLng);
    } catch (e) {
        console.error('ERROR: ' + e.message);
    } finally {
        await pool.end();
    }
}

verify();
