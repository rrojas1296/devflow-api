import dotenv from 'dotenv';

import { defineConfig } from 'drizzle-kit';

dotenv.config({
  path: '.env.development',
});
export default defineConfig({
  out: './drizzle',
  schema: './src/infrastructure/database/drizzle/schemas/**.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
