import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { JobsService } from '../application/jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}
  @Get()
  async getJobs() {
    const data = await this.jobsService.getJobs();

    return {
      statusCode: HttpStatus.OK,
      message: 'Jobs fetched successfully',
      data,
    };
  }

  @Post()
  async createJob(@Body() data: any) {
    const id = await this.jobsService.createJob(data);

    return {
      statusCode: HttpStatus.OK,
      message: 'Job created successfully',
      data: id,
    };
  }
}
