// db.ts
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not set in environment variables!');
}
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }, // Required by Railway
});

export async function getEmails(): Promise<{ name: string; email: string }[]> {
    const result = await pool.query('SELECT name, email FROM emails');
    // Remove 'mailto:' if present
    return result.rows.map((row) => ({
        name: row.name,
        email: row.email.replace(/^mailto:/, ''),
    }));
}
