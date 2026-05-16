import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JobsScraperService } from '../scraper/jobs-scraper.service';
import { JobsRepository } from '../jobs.repository';
import { JOBS_QUEUE } from 'src/infrastructure/queue/bullmq.config';
import { ScraperDto } from '../../presentation/dtos/scraper.dto';

@Processor(JOBS_QUEUE)
export class JobsProcessor extends WorkerHost {
  constructor(
    private readonly scraper: JobsScraperService,
    private readonly repository: JobsRepository,
  ) {
    super();
  }

  async process(job: Job<ScraperDto>) {
    console.log({
      job: job.data,
    });
    const jobs = await this.scraper.scrape(job.data);

    // await this.repository.bullkJobs(jobs);
    return { insetrted: jobs?.length };
  }
}
