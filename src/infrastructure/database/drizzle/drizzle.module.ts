import { Module } from '@nestjs/common';
import * as schema from 'src/infrastructure/database/drizzle/schemas';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { environments } from 'src/config/env';
import { DRIZZLE_TOKEN } from './tokens/drizzle.tokens';

@Module({
  providers: [
    {
      provide: DRIZZLE_TOKEN,
      useFactory: () => {
        const pool = new Pool({
          connectionString: environments.DATABASE_URL,
        });

        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DRIZZLE_TOKEN],
})
export class DrizzleModule {}
