import { Module } from '@nestjs/common';
import { db } from './drizzle.client';

@Module({
  providers: [
    {
      provide: 'DRIZZLE',
      useFactory: () => db,
    },
  ],
  exports: ['DRIZZLE'],
})
export class DrizzleModule {}
