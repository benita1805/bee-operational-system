require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const SCHEMA_PATH = path.join(__dirname, '../src/db/schema.sql');

async function initDB() {
    console.log('=== Database Initialization ===');

    if (!process.env.DATABASE_URL) {
        console.error('❌ Error: DATABASE_URL is not defined in .env');
        console.error('Please add your Supabase connection string to .env');
        process.exit(1);
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('✓ Connected');

        console.log('Reading schema file...');
        const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');

        console.log('Executing schema...');
        await client.query(schemaSql);
        console.log('✓ Schema applied successfully');

    } catch (error) {
        console.error('❌ Failed to initialize database:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

initDB();
