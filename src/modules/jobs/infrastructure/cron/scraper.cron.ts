import { Injectable } from '@nestjs/common';
import { ScrapeJobsUseCase } from '../../application/use-cases/scrape-jobs.use-case';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ScraperCron {
  constructor(private readonly scrapeJobsUseCase: ScrapeJobsUseCase) {}

  @Cron('*/5 * * * * *')
  async handleCron() {
    console.log('Running scraper cron');
    await this.scrapeJobsUseCase.execute('linkedin');
  }
}
