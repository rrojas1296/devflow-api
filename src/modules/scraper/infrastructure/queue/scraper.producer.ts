import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  SCRAPER_JOBS,
  SCRAPER_QUEUE,
} from 'src/infrastructure/bullmq/bullmq.config';
import type { IScraperProducer } from '../../domain/ports/scraper-producer.port';
import { ScraperJobsInput } from '../../application/dto/scraper-jobs.input';

@Injectable()
export class ScraperProducer implements IScraperProducer {
  constructor(@InjectQueue(SCRAPER_QUEUE) private queue: Queue) {}

  async scrapeJobs(data: ScraperJobsInput) {
    await this.queue.add(SCRAPER_JOBS, data, {
      removeOnComplete: true,
    });
  }
}
