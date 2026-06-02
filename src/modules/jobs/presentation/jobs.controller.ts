import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { CreateJobDto } from './dtos/create-job.dto';
import { GetJobsUseCase } from '../application/use-cases/get-jobs.use-case';
import { CreateJobUseCase } from '../application/use-cases/create-job.use-case';
import { JobCreateInput } from '../domain/entities/job.entity';
import { ManipulateType } from 'dayjs';
import type { Modality } from '../domain/enums/modality.enum';

@Controller('jobs')
export class JobsController {
  constructor(
    private getJobsUseCase: GetJobsUseCase,
    private createJobUseCase: CreateJobUseCase,
  ) {}
  @Get()
  async getJobs(
    @Query('location') location: string,
    @Query('technologies') technologies: string[],
    @Query('publicationDate') publicationDate: ManipulateType | 'all',
    @Query('modality') modality: Modality | 'all',
    @Query('search') search?: string,
  ) {
    const data = await this.getJobsUseCase.execute(
      location,
      technologies,
      publicationDate,
      modality,
      search,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Jobs fetched successfully',
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
