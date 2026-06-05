import { Injectable } from '@nestjs/common';
import { JobScraperService } from '../../domain/services/job-scraper.service';
import { SourceJobResult } from '../../domain/interfaces/source-job-result.interface';

@Injectable()
export class ProccessDataUseCase {
  constructor(private readonly scraperService: JobScraperService) {}

  async execute(jobs: SourceJobResult[]) {
    return this.scraperService.processScrapedJobs(jobs);
  }
}
