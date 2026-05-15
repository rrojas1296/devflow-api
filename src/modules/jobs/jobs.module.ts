import { Module } from '@nestjs/common';
import { JobsRepository } from './infrastructure/jobs.repository';
import { JobsController } from './presentation/jobs.controller';
import { GetJobsUseCase } from './application/use-cases/get-jobs.use-case';
import { CreateJobUseCase } from './application/use-cases/create-job.use-case';
import { JobsProducer } from './infrastructure/queue/scraper.producer';
import { JobsProcessor } from './infrastructure/queue/scraper.processor';
import { JobsScraperService } from './infrastructure/scraper/jobs-scraper.service';
import { LinkedinSource } from './infrastructure/scraper/sources/linkedin.source';
import { BullModule } from '@nestjs/bullmq';
import { ScrapeJobsUseCase } from './application/use-cases/scrape-jobs.use-case';
import { QueueModule } from 'src/infrastructure/queue/bullmq.module';
import { JOBS_QUEUE } from 'src/infrastructure/queue/bullmq.config';
import { DrizzleModule } from 'src/infrastructure/database/drizzle/drizzle.module';
import { ScraperCron } from './infrastructure/cron/scraper.cron';

const USE_CASES = [CreateJobUseCase, ScrapeJobsUseCase, GetJobsUseCase];
const SOURCES = [LinkedinSource];
const CRONS = [ScraperCron];
const BULLMQ = [JobsProducer, JobsProcessor];
const SERVICES = [JobsScraperService];
const REPOSITORIES = [JobsRepository];

@Module({
  imports: [
    DrizzleModule,
    QueueModule,
    BullModule.registerQueue({
      name: JOBS_QUEUE,
    }),
  ],
  controllers: [JobsController],
  providers: [
    ...USE_CASES,
    ...SOURCES,
    ...CRONS,
    ...BULLMQ,
    ...SERVICES,
    ...REPOSITORIES,
  ],
})
export class JobsModule {}
