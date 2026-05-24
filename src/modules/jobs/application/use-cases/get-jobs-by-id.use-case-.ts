import { Inject, Injectable } from '@nestjs/common';
import type { IJobsRepository } from '../../domain/interfaces/jobs-repository.interface';
import { JOBS_REPOSITORY } from '../../domain/tokens/jobs.tokens';

@Injectable()
export class GetJobsByIdUseCase {
  constructor(@Inject(JOBS_REPOSITORY) private repository: IJobsRepository) {}
  execute(ids: string[]) {
    return this.repository.getJobsByIds(ids);
  }
}
