import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JobsModule } from './modules/jobs/jobs.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [JobsModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
