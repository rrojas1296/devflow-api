import { Injectable } from '@nestjs/common';
import { JobsRepository } from '../../infrastructure/jobs.repository';
import { CreateJobDto } from '../../presentation/dtos/create-job.dto';

@Injectable()
export class CreateJobUseCase {
  constructor(private jobsRepo: JobsRepository) {}
  execute(data: CreateJobDto) {
    return this.jobsRepo.createJob(data);
  }
}
