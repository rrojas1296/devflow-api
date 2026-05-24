import { Module, Provider } from '@nestjs/common';
import { JobsModule } from '../jobs/jobs.module';
import { BullModule } from '@nestjs/bullmq';
import { ScraperJobsUseCase } from './application/use-cases/scrape-jobs.use-case';
import { ProccessDataUseCase } from './application/use-cases/proccess-data.use-case';
import { ScraperProducer } from './infrastructure/scraper.producer';
import { ScraperProcessor } from './infrastructure/scraper.processor';
import { CloudinaryModule } from 'src/infrastructure/cloudinary/cloudinary.module';
import { ScraperOrchestrator } from './application/services/scraper.orchestrator';
import { LinkedinSource } from './infrastructure/sources/linkedin.source';
import { ScraperController } from './presentation/scraper.controller';
import { SCRAPER_QUEUE } from 'src/infrastructure/bullmq/bullmq.config';
import {
  SCRAPER_PRODUCER,
  SCRAPER_SOURCES,
} from './domain/tokens/scraper.tokens';

const USE_CASES: Provider[] = [
  ProccessDataUseCase,
  ScraperJobsUseCase,
  ScraperOrchestrator,
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
    CloudinaryModule,
    BullModule.registerQueue({
      name: SCRAPER_QUEUE,
    }),
  ],
  providers: [...USE_CASES, ...BULLMQ, ...SOURCES],
  controllers: [ScraperController],
})
export class ScraperModule {}
