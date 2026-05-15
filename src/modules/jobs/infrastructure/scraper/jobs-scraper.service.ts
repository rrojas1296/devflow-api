import { Injectable } from '@nestjs/common';
import { LinkedinSource } from './sources/linkedin.source';

@Injectable()
export class JobsScraperService {
  constructor(private readonly linkedin: LinkedinSource) {}

  async scrape(source: string) {
    switch (source) {
      case 'linkedin':
        return this.linkedin.fetchJobs();
      default:
        return [];
    }
  }
}
