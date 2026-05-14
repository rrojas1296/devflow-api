import { Module } from '@nestjs/common';
import { DrizzleModule } from 'src/database/drizzle/drizzle.module';
import { JobsRepository } from './infrastructure/jobs.repository';
import { JobsController } from './presentation/jobs.controller';
import { GetJobsUseCase } from './application/use-cases/get-jobs.use-case';
import { CreateJobUseCase } from './application/use-cases/create-job.use-case';
import { JobsProducer } from './infrastructure/queue/jobs.producer';
import { JobsProcessor } from './infrastructure/queue/jobs.processor';
import { JobsScraperService } from './infrastructure/scraper/jobs-scraper.service';
import { LinkedinSource } from './infrastructure/scraper/sources/linkedin.source';
import { BullModule } from '@nestjs/bullmq';
import { JOBS_QUEUE } from './infrastructure/queue/jobs.queue';

@Module({
  controllers: [JobsController],
  providers: [
    GetJobsUseCase,
    CreateJobUseCase,
    {
      provide: 'JOBS_REPOSITORY',
      useClass: JobsRepository,
    },
    JobsProducer,
    JobsProcessor,
    JobsScraperService,
    LinkedinSource,
  ],
  imports: [
    DrizzleModule,
    BullModule.registerQueue({
      name: JOBS_QUEUE,
    }),
  ],
})
export class JobsModule {}
