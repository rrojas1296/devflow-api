import { Injectable } from '@nestjs/common';
import { JobsRepository } from '../infrastructure/jobs.repository';

@Injectable()
export class JobsService {
  constructor(private jobsRepo: JobsRepository) {}

  getJobs() {
    return this.jobsRepo.getJobs();
  }

  createJob(data: any) {
    return this.jobsRepo.createJob(data);
  }
}
