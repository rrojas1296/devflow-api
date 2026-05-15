import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JobsScraperService } from '../scraper/jobs-scraper.service';
import { JobsRepository } from '../jobs.repository';
import { JOBS_QUEUE } from 'src/infrastructure/queue/bullmq.config';

@Processor(JOBS_QUEUE)
export class JobsProcessor extends WorkerHost {
  constructor(
    private readonly scraper: JobsScraperService,
    private readonly repository: JobsRepository,
  ) {
    super();
  }

  async process(job: Job<{ source: string }>) {
    console.log({
      source: job.data.source,
    });
    const jobs = await this.scraper.scrape(job.data.source);
    await this.repository.bullkJobs(jobs);
    return { insetrted: jobs?.length };
  }
}
