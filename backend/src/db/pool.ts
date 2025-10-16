import { Pool } from 'pg';
import { env } from '../config/env';

export const pool = new Pool({
  connectionString: env.databaseUrl
});

export const query = (text: string, params?: unknown[]) => pool.query(text, params);
