import { JobCreateInput } from 'src/modules/jobs/domain/entities/job.entity';
import { ScraperJobsInput } from '../../application/dto/scraper-jobs.input';

export interface IScraperSource {
  key: string;
  fetch(data: ScraperJobsInput): Promise<JobCreateInput[]>;
}
