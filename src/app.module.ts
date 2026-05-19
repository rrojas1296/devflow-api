import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JobsModule } from './modules/jobs/jobs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';

@Module({
  imports: [JobsModule, ScheduleModule.forRoot(), CloudinaryModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
