import { Inject, Injectable } from '@nestjs/common';
import { JOBS_REPOSITORY } from '../../domain/tokens/jobs.tokens';
import type { IJobsRepository } from '../../domain/ports/jobs-repository.port';
import { ManipulateType } from 'dayjs';
import { Modality } from '../../domain/enums/modality.enum';

@Injectable()
export class GetJobsUseCase {
  constructor(@Inject(JOBS_REPOSITORY) private jobsRepo: IJobsRepository) {}
  execute(
    location: string,
    technologies: string[],
    publicationDate: ManipulateType | 'all',
    modality: Modality | 'all',
    search?: string,
  ) {
    return this.jobsRepo.getJobs(
      location,
      technologies,
      publicationDate,
      modality,
      search,
    );
  }
}
