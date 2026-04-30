import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DATABASE_URL } from 'src/config/environment';
import * as schema from './schemas';

const pool = new Pool({
  connectionString: DATABASE_URL,
});
export const db = drizzle(pool, { schema });
