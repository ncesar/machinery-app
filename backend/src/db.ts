import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
});

const query = (text: string, params?: any[]) => pool.query(text, params);

export default { query };
