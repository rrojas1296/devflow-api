import { Module } from '@nestjs/common';
import { DrizzleModule } from 'src/database/drizzle/drizzle.module';
import { JobsController } from './infrastructure/jobs.controller';
import { JobsService } from './application/jobs.service';
import { JobsRepository } from './infrastructure/jobs.repository';

@Module({
  controllers: [JobsController],
  providers: [JobsService, JobsRepository],
  imports: [DrizzleModule],
})
export class JobsModule {}
