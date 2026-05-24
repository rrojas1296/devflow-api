import { Inject, Injectable } from '@nestjs/common';
import type { IJobsRepository } from '../../domain/interfaces/jobs-repository.interface';
import type { JobCreateInput } from '../../domain/entities/job.entity';
import { JOBS_REPOSITORY } from '../../domain/tokens/jobs.tokens';

@Injectable()
export class CreateJobUseCase {
  constructor(@Inject(JOBS_REPOSITORY) private jobsRepo: IJobsRepository) {}
  execute(data: JobCreateInput) {
    return this.jobsRepo.createJob(data);
  }
}
