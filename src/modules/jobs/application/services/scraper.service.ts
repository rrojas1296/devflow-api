import { Injectable } from '@nestjs/common';
import { ScraperJobsCommand } from '../../application/commands/scrape-jobs.command';
import { LinkedinSource } from '../../infrastructure/scraper/sources/linkedin.source';

@Injectable()
export class ScraperService {
  constructor(private linkedinSource: LinkedinSource) {}

  scrape(data: ScraperJobsCommand) {
    switch (data.source) {
      case 'linkedin':
        return this.linkedinSource.fetchJobs(data);
      default:
        throw new Error('Invalid source');
    }
  }
}
