import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { environments } from 'src/config/env';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: environments.REDIS_HOST,
        port: environments.REDIS_PORT,
      },
    }),
  ],
})
export class QueueModule {}
