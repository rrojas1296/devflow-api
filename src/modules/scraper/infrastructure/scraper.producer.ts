import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  SCRAPER_JOBS,
  SCRAPER_QUEUE,
} from 'src/infrastructure/bullmq/bullmq.config';
import { ScraperJobsCommand } from '../application/commands/scraper-jobs.command';

@Injectable()
export class ScraperProducer {
  constructor(@InjectQueue(SCRAPER_QUEUE) private queue: Queue) {}

  async scrapeJobs(data: ScraperJobsCommand) {
    await this.queue.add(SCRAPER_JOBS, data, {
      removeOnComplete: true,
    });
  }
}
