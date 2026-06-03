import { Inject, Injectable } from '@nestjs/common';
import { JOBS_REPOSITORY } from '../../domain/tokens/jobs.tokens';
import type { IJobsRepository } from '../../domain/ports/jobs-repository.port';

@Injectable()
export class GetLocationsUseCase {
  constructor(
    @Inject(JOBS_REPOSITORY) private readonly jobsRepo: IJobsRepository,
  ) {}

  execute() {
    return this.jobsRepo.getLocations();
  }
}
