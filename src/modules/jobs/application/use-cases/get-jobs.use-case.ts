import { Injectable } from '@nestjs/common';
import { JobsRepository } from '../../infrastructure/jobs.repository';

@Injectable()
export class GetJobsUseCase {
  constructor(private jobsRepo: JobsRepository) {}
  execute() {
    return this.jobsRepo.getJobs();
  }
}
