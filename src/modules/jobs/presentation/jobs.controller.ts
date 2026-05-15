import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { CreateJobDto } from './dtos/create-job.dto';
import { GetJobsUseCase } from '../application/use-cases/get-jobs.use-case';
import { CreateJobUseCase } from '../application/use-cases/create-job.use-case';
import { ScrapeJobsUseCase } from '../application/use-cases/scrape-jobs.use-case';

@Controller('jobs')
export class JobsController {
  constructor(
    private getJobsUseCase: GetJobsUseCase,
    private createJobUseCase: CreateJobUseCase,
    private scrapeJobsUseCase: ScrapeJobsUseCase,
  ) {}
  @Get()
  async getJobs() {
    const data = await this.getJobsUseCase.execute();

    return {
      statusCode: HttpStatus.OK,
      message: 'Jobs fetched successfully',
      data,
    };
  }

  @Post()
  async createJob(@Body() data: CreateJobDto) {
    const id = await this.createJobUseCase.execute(data);

    return {
      statusCode: HttpStatus.OK,
      message: 'Job created successfully',
      data: id,
    };
  }

  @Post('scrape')
  scrape(@Body() dto: { source: string }) {
    this.scrapeJobsUseCase.execute(dto.source);
    return {
      message: 'Jobs scrapper initialized',
      statusCode: HttpStatus.OK,
    };
  }
}
