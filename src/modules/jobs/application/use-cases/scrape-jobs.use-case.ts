import { Injectable } from '@nestjs/common';
import { JobsProducer } from '../../infrastructure/queue/scraper.producer';
import { ScraperDto } from '../../presentation/dtos/scraper.dto';

@Injectable()
export class ScrapeJobsUseCase {
  constructor(private readonly producer: JobsProducer) {}

  async execute(data: ScraperDto) {
    await this.producer.scrapeJobs(data);
  }
}
