import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { CreateJobDto } from './dtos/create-job.dto';
import { GetJobsUseCase } from '../application/use-cases/get-jobs.use-case';
import { CreateJobUseCase } from '../application/use-cases/create-job.use-case';
import { JobCreateInput } from '../domain/entities/job.entity';
import { GetLocationsUseCase } from '../application/use-cases/get-locations.use-case';

@Controller('jobs')
export class JobsController {
  constructor(
    private getJobsUseCase: GetJobsUseCase,
    private createJobUseCase: CreateJobUseCase,
    private getLocationsUseCase: GetLocationsUseCase,
  ) {}
  @Get()
  async getJobs(
    @Query('location') location?: string,
    @Query('technologies') technologies?: string,
    @Query('publicationDate') publicationDate?: string,
    @Query('modality') modality?: string,
    @Query('source') source?: string,
    @Query('search') search?: string,
  ) {
    const data = await this.getJobsUseCase.execute({
      location,
      technologies,
      publicationDate,
      modality,
      source,
      search,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Jobs fetched successfully',
      data,
    };
  }

  @Get('locations')
  async getLocations() {
    const data = await this.getLocationsUseCase.execute();
    return {
      statusCode: HttpStatus.OK,
      message: 'Locations fetched successfully',
      data,
    };
  }

  @Post()
  async createJob(@Body() data: CreateJobDto) {
    const input: JobCreateInput = {
      title: data.title,
      description: data.description,
      companyName: data.companyName,
      location: data.location,
      stack: data.stack,
      imageUrl: data.imageUrl ?? null,
      linkUrl: data.linkUrl,
      modality: data.modality,
      postedDate: data.postedDate,
      externalId: data.externalId,
      source: data.source,
    };
    const job = await this.createJobUseCase.execute(input);

    return {
      statusCode: HttpStatus.OK,
      message: 'Job created successfully',
      data: job.id,
    };
  }
}
