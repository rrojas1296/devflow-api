import { Injectable } from '@nestjs/common';

@Injectable()
export class LinkedinSource {
  name = 'linkedin';

  async fetchJobs(): Promise<{ name: string; title: string }[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Playwright logic here
    return [];
  }
}
