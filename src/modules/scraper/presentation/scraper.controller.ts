import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ScraperDto } from './dtos/scraper-jobs.dto';
import { ScraperJobsCommand } from '../application/commands/scraper-jobs.command';
import { ScraperJobsUseCase } from '../application/use-cases/scrape-jobs.use-case';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperJobsUseCase: ScraperJobsUseCase) {}
  @Post()
  scrapeJobs(@Body() body: ScraperDto) {
    const data: ScraperJobsCommand = {
      keywords: body.keywords,
      modality: body.modality,
      source: body.source,
    };
    this.scraperJobsUseCase.execute(data);
    return {
      message: 'Jobs scraped successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
