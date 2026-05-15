import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/infrastructure/database/drizzle/schemas';

export type DrizzleDB = NodePgDatabase<typeof schema>;
