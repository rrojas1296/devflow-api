import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  JOBS_QUEUE,
  SCRAPE_JOBS,
} from 'src/infrastructure/queue/bullmq.config';
import { ScraperDto } from '../../presentation/dtos/scraper.dto';

@Injectable()
export class JobsProducer {
  constructor(@InjectQueue(JOBS_QUEUE) private queue: Queue) {}

  async scrapeJobs(data: ScraperDto) {
    await this.queue.add(SCRAPE_JOBS, data, {
      removeOnComplete: true,
    });
  }
}
