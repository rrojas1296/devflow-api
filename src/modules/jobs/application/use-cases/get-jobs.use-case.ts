import { Inject, Injectable } from '@nestjs/common';
import { JobsRepository } from '../../infrastructure/jobs.repository';

@Injectable()
export class GetJobsUseCase {
  constructor(@Inject('JOBS_REPOSITORY') private jobsRepo: JobsRepository) {}
  execute() {
    return this.jobsRepo.getJobs();
  }
}
