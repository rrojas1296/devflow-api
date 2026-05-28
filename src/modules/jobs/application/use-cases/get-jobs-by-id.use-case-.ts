import { Inject, Injectable } from '@nestjs/common';
import { JOBS_REPOSITORY } from '../../domain/tokens/jobs.tokens';
import type { IJobsRepository } from '../../domain/ports/jobs-repository.port';

@Injectable()
export class GetJobsByIdUseCase {
  constructor(@Inject(JOBS_REPOSITORY) private repository: IJobsRepository) {}
  execute(ids: string[]) {
    return this.repository.getJobsByIds(ids);
  }
}
