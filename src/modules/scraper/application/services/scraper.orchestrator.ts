import { Inject, Injectable } from '@nestjs/common';
import { ScraperJobsCommand } from '../commands/scraper-jobs.command';
import type { IScraperSource } from '../../domain/interfaces/scraper-source.interface';
import { SCRAPER_SOURCES } from '../../domain/tokens/scraper.tokens';

@Injectable()
export class ScraperOrchestrator {
  constructor(
    @Inject(SCRAPER_SOURCES)
    private readonly sources: IScraperSource[],
  ) {}

  scrape(data: ScraperJobsCommand) {
    const source = this.sources.find((s) => s.key === data.source);

    if (!source) {
      throw new Error(`Source ${data.source} not found`);
    }

    return source.fetch(data);
  }
}
