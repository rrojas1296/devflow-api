import { ScraperJobsInput } from '../../application/dto/scraper-jobs.input';

export interface IScraperProducer {
  scrapeJobs(data: ScraperJobsInput): Promise<void>;
}
