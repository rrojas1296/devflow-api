import { Inject, Injectable } from '@nestjs/common';
import { SCRAPER_SOURCES } from '../../domain/tokens/scraper.tokens';
import type { IScraperSource } from '../../domain/ports/scraper-source.port';
import { ScraperJobsInput } from '../dto/scraper-jobs.input';

@Injectable()
export class ScraperSourceUseCase {
  constructor(
    @Inject(SCRAPER_SOURCES)
    private readonly sources: IScraperSource[],
  ) {}

  scrape(data: ScraperJobsInput) {
    const source = this.sources.find((s) => s.key === data.source);

    if (!source) {
      throw new Error(`Source ${data.source} not found`);
    }

    return source.fetch(data);
  }
}
