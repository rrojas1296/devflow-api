import { Injectable } from '@nestjs/common';
import { LinkedinSource } from './sources/linkedin.source';

@Injectable()
export class JobsScraperService {
  constructor(private readonly linkedin: LinkedinSource) {}

  async scrape(source: string) {
    if (source === 'linkedin') {
      return this.linkedin.fetchJobs();
    }
  }
}
