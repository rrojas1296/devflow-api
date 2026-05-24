import { Inject, Injectable } from '@nestjs/common';
import { ScraperJobsCommand } from '../commands/scraper-jobs.command';
import type { IScraperProducer } from '../../domain/interfaces/scraper-producer.interface';
import { SCRAPER_PRODUCER } from '../../domain/tokens/scraper.tokens';

@Injectable()
export class ScraperJobsUseCase {
  constructor(
    @Inject(SCRAPER_PRODUCER) private readonly producer: IScraperProducer,
  ) {}

  async execute(data: ScraperJobsCommand) {
    await this.producer.scrapeJobs(data);
  }
}
