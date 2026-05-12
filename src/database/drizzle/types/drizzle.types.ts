import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/database/drizzle/schemas';

export type DrizzleDB = NodePgDatabase<typeof schema>;
