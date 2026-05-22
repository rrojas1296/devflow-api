import { Module } from '@nestjs/common';
import { JobsRepository } from './infrastructure/jobs.repository';
import { JobsController } from './presentation/jobs.controller';
import { GetJobsUseCase } from './application/use-cases/get-jobs.use-case';
import { CreateJobUseCase } from './application/use-cases/create-job.use-case';
import { JobsProducer } from './infrastructure/queue/scraper.producer';
import { JobsProcessor } from './infrastructure/queue/scraper.processor';
import { BullModule } from '@nestjs/bullmq';
import { ScrapeJobsUseCase } from './application/use-cases/scrape-jobs.use-case';
import { QueueModule } from 'src/infrastructure/bullmq/bullmq.module';
import { JOBS_QUEUE } from 'src/infrastructure/bullmq/bullmq.config';
import { DrizzleModule } from 'src/infrastructure/database/drizzle/drizzle.module';
import { LinkedinSource } from './infrastructure/scraper/sources/linkedin.source';
import { ScraperService } from './application/services/scraper.service';

const USE_CASES = [CreateJobUseCase, ScrapeJobsUseCase, GetJobsUseCase];
const BULLMQ = [JobsProducer, JobsProcessor];
const REPOSITORIES = [JobsRepository];
const SCRAPER = [ScraperService, LinkedinSource];

@Module({
  imports: [
    DrizzleModule,
    QueueModule,
    BullModule.registerQueue({
      name: JOBS_QUEUE,
    }),
  ],
  controllers: [JobsController],
  providers: [...USE_CASES, ...BULLMQ, ...REPOSITORIES, ...SCRAPER],
})
export class JobsModule {}
