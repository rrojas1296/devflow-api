import { Module } from '@nestjs/common';
import { LinkedinSource } from './sources/linkedin.source';
import { ScraperService } from './services/scraper.service';

@Module({
  providers: [ScraperService, LinkedinSource],
  exports: [ScraperService],
})
export class ScraperModule {}
