import { Inject, Injectable } from '@nestjs/common';
import { SCRAPER_PRODUCER } from '../../domain/tokens/scraper.tokens';
import { ScraperJobsInput } from '../dto/scraper-jobs.input';
import type { IScraperProducer } from '../../domain/ports/scraper-producer.port';

@Injectable()
export class ScraperJobsUseCase {
  constructor(
    @Inject(SCRAPER_PRODUCER) private readonly producer: IScraperProducer,
  ) {}

  async execute(data: ScraperJobsInput) {
    await this.producer.scrapeJobs(data);
  }
}
