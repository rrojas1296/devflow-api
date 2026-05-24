import { JobCreateInput } from 'src/modules/jobs/domain/entities/job.entity';
import { ScraperJobsCommand } from '../../application/commands/scraper-jobs.command';

export interface IScraperSource {
  key: string;
  fetch(data: ScraperJobsCommand): Promise<JobCreateInput[]>;
}
