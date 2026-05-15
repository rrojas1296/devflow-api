import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { REDIS_HOST, REDIS_PORT } from 'src/config/env';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: REDIS_HOST,
        port: REDIS_PORT,
      },
    }),
  ],
})
export class QueueModule {}
