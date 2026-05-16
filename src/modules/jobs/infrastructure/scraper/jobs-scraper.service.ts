import { Injectable } from '@nestjs/common';
import { LinkedinSource } from './sources/linkedin.source';
import { ScraperDto } from '../../presentation/dtos/scraper.dto';

@Injectable()
export class JobsScraperService {
  constructor(private readonly linkedin: LinkedinSource) {}

  async scrape(data: ScraperDto) {
    switch (data.source) {
      case 'linkedin':
        return this.linkedin.fetchJobs(data);
      default:
        return [];
    }
  }
}
