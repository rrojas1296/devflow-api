import { ScraperJobsCommand } from '../../application/commands/scraper-jobs.command';

export interface IScraperProducer {
  scrapeJobs(data: ScraperJobsCommand): Promise<void>;
}
