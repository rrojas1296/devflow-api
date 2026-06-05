import { ScraperJobsInput } from '../../application/dto/scraper-jobs.input';
import { SourceJobResult } from '../interfaces/source-job-result.interface';

export interface IScraperSource {
  key: string;
  fetch(data: ScraperJobsInput): Promise<SourceJobResult[]>;
}
