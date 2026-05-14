import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JobsModule } from './modules/jobs/jobs.module';
import { QueueModule } from './modules/jobs/infrastructure/queue/queue.module';

@Module({
  imports: [JobsModule, QueueModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
