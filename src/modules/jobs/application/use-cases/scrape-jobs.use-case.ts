import { Injectable } from '@nestjs/common';
import { JobsProducer } from '../../infrastructure/queue/scraper.producer';

@Injectable()
export class ScrapeJobsUseCase {
  constructor(private readonly producer: JobsProducer) {}

  async execute(source: string) {
    await this.producer.scrapeJobs(source);
  }
}
