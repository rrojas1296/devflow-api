import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ScraperJobsCommand } from '../application/commands/scraper-jobs.command';
import { SCRAPER_QUEUE } from 'src/infrastructure/bullmq/bullmq.config';
import { ProccessDataUseCase } from '../application/use-cases/proccess-data.use-case';
import { ScraperOrchestrator } from '../application/services/scraper.orchestrator';

@Processor(SCRAPER_QUEUE)
export class ScraperProcessor extends WorkerHost {
  constructor(
    private readonly scraperOrchestractor: ScraperOrchestrator,
    private readonly processScrapedJobs: ProccessDataUseCase,
  ) {
    super();
  }

  async process(job: Job<ScraperJobsCommand>) {
    try {
      const jobs = await this.scraperOrchestractor.scrape(job.data);

      const result = await this.processScrapedJobs.execute(jobs);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
