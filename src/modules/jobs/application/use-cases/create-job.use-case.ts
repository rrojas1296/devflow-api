import { Inject, Injectable } from '@nestjs/common';
import type { JobCreateInput } from '../../domain/entities/job.entity';
import { JOBS_REPOSITORY } from '../../domain/tokens/jobs.tokens';
import type { IJobsRepository } from '../../domain/ports/jobs-repository.port';

@Injectable()
export class CreateJobUseCase {
  constructor(@Inject(JOBS_REPOSITORY) private jobsRepo: IJobsRepository) {}
  execute(data: JobCreateInput) {
    return this.jobsRepo.createJob(data);
  }
}
