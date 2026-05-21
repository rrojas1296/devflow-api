import { Injectable } from '@nestjs/common';
import { LinkedinSource } from '../sources/linkedin.source';
import { ScraperData } from '../types/scraper-data.interface';

@Injectable()
export class ScraperService {
  constructor(private readonly linkedin: LinkedinSource) {}

  async scrape(data: ScraperData) {
    switch (data.source) {
      case 'linkedin':
        return this.linkedin.fetchJobs(data);
      default:
        return [];
    }
  }
}
