import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { JOBS_QUEUE, SCRAPE_JOBS } from './jobs.queue';
import { Queue } from 'bullmq';

@Injectable()
export class JobsProducer {
  constructor(@InjectQueue(JOBS_QUEUE) private queue: Queue) {}

  async scrapeJobs(source: string) {
    await this.queue.add(
      SCRAPE_JOBS,
      { source },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
      },
    );
  }
}
