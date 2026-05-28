import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ScraperDto } from './dtos/scraper-jobs.dto';
import { ScraperJobsUseCase } from '../application/use-cases/scrape-jobs.use-case';
import { ScraperJobsInput } from '../application/dto/scraper-jobs.input';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperJobsUseCase: ScraperJobsUseCase) {}
  @Post()
  scrapeJobs(@Body() body: ScraperDto) {
    const data: ScraperJobsInput = {
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
