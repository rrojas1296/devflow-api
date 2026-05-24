import { Inject, Injectable } from '@nestjs/common';
import type { IJobsRepository } from '../../domain/interfaces/jobs-repository.interface';
import { JobCreateInput } from '../../domain/entities/job.entity';
import { JOBS_REPOSITORY } from '../../domain/tokens/jobs.tokens';

@Injectable()
export class BulkJobsUseCase {
  constructor(
    @Inject(JOBS_REPOSITORY) private readonly repository: IJobsRepository,
  ) {}
  execute(data: JobCreateInput[]) {
    return this.repository.bulkJobs(data);
  }
}
