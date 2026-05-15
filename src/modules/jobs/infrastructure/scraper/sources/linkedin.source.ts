import { Injectable } from '@nestjs/common';
import { JobsCreateInput } from 'src/infrastructure/database/drizzle/schemas';

@Injectable()
export class LinkedinSource {
  name = 'linkedin';

  async fetchJobs(): Promise<JobsCreateInput[]> {
    console.log(`Scraping ${this.name}`);
    await new Promise((resolve) => setTimeout(resolve, 10000));
    // Playwright logic here
    console.log('Finished scraping');
    return [];
  }
}
