import { Module } from '@nestjs/common';
import { db } from './drizzle';

@Module({
  providers: [
    {
      provide: 'DRIZZLE_DB',
      useFactory: () => db,
    },
  ],
  exports: ['DRIZZLE_DB'],
})
export class DrizzleModule {}
