import { Processor, WorkerHost } from '@nestjs/bullmq';
import { JOBS_QUEUE } from './jobs.queue';
import { Job } from 'bullmq';
import { JobsScraperService } from '../scraper/jobs-scraper.service';

@Processor(JOBS_QUEUE)
export class JobsProcessor extends WorkerHost {
  constructor(private readonly scraper: JobsScraperService) {
    super();
  }

  async process(job: Job<{ source: string }>) {
    const jobs = await this.scraper.scrape(job.data.source);
    return { insetrted: jobs?.length };
  }
}
