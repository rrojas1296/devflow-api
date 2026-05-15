import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  JOBS_QUEUE,
  SCRAPE_JOBS,
} from 'src/infrastructure/queue/bullmq.config';

@Injectable()
export class JobsProducer {
  constructor(@InjectQueue(JOBS_QUEUE) private queue: Queue) {}

  async scrapeJobs(source: string) {
    await this.queue.add(
      SCRAPE_JOBS,
      { source },
      {
        removeOnComplete: true,
      },
    );
  }
}
