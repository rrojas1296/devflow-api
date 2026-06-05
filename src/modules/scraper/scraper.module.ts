import { Module, Provider } from '@nestjs/common';
import { JobsModule } from '../jobs/jobs.module';
import { BullModule } from '@nestjs/bullmq';
import { ScraperJobsUseCase } from './application/use-cases/scrape-jobs.use-case';
import { ProccessDataUseCase } from './application/use-cases/proccess-data.use-case';
import { CloudinaryModule } from 'src/infrastructure/cloudinary/cloudinary.module';
import { LinkedinSource } from './infrastructure/sources/linkedin.source';
import { ScraperController } from './presentation/scraper.controller';
import { SCRAPER_QUEUE } from 'src/infrastructure/bullmq/bullmq.config';
import {
  SCRAPER_PRODUCER,
  SCRAPER_SOURCES,
} from './domain/tokens/scraper.tokens';
import { ScraperSourceUseCase } from './application/use-cases/scraper-source.use-case';
import { ScraperProducer } from './infrastructure/queue/scraper.producer';
import { ScraperProcessor } from './infrastructure/queue/scraper.processor';
import { CompaniesModule } from '../companies/companies.module';
import { ProcessCompaniesUseCase } from './application/use-cases/process-companies.use-case';

const USE_CASES: Provider[] = [
  ProccessDataUseCase,
  ProcessCompaniesUseCase,
  ScraperJobsUseCase,
  ScraperSourceUseCase,
  {
    provide: SCRAPER_PRODUCER,
    useClass: ScraperProducer,
  },
  {
    provide: SCRAPER_SOURCES,
    useFactory: (linkedin: LinkedinSource) => [linkedin],
    inject: [LinkedinSource],
  },
];

const SOURCES: Provider[] = [LinkedinSource];

const BULLMQ: Provider[] = [ScraperProcessor];

@Module({
  imports: [
    JobsModule,
    CompaniesModule,
    CloudinaryModule,
    BullModule.registerQueue({
      name: SCRAPER_QUEUE,
    }),
  ],
  providers: [...USE_CASES, ...BULLMQ, ...SOURCES],
  controllers: [ScraperController],
})
export class ScraperModule {}
