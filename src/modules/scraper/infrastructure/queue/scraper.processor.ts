import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SCRAPER_QUEUE } from 'src/infrastructure/bullmq/bullmq.config';
import { ScraperSourceUseCase } from '../../application/use-cases/scraper-source.use-case';
import { ProccessDataUseCase } from '../../application/use-cases/proccess-data.use-case';
import { ScraperJobsInput } from '../../application/dto/scraper-jobs.input';

@Processor(SCRAPER_QUEUE)
export class ScraperProcessor extends WorkerHost {
  constructor(
    private readonly scraperSourceUseCase: ScraperSourceUseCase,
    private readonly processScrapedJobsUseCase: ProccessDataUseCase,
  ) {
    super();
  }

  async process(job: Job<ScraperJobsInput>) {
    try {
      const jobs = await this.scraperSourceUseCase.scrape(job.data);

      const result = await this.processScrapedJobsUseCase.execute(jobs);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
