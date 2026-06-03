import { Inject, Injectable } from '@nestjs/common';
import { JOBS_REPOSITORY } from '../../domain/tokens/jobs.tokens';
import type { IJobsRepository } from '../../domain/ports/jobs-repository.port';
import { ManipulateType } from 'dayjs';
import { Modality } from '../../domain/enums/modality.enum';

@Injectable()
export class GetJobsUseCase {
  constructor(@Inject(JOBS_REPOSITORY) private jobsRepo: IJobsRepository) {}
  execute({
    location,
    technologies,
    publicationDate,
    modality,
    source,
    search,
  }: {
    location?: string;
    technologies?: string;
    publicationDate?: string;
    modality?: string;
    source?: string;
    search?: string;
  }) {
    const data = {
      location: location?.split(',') || [],
      technologies: technologies?.split(',') || [],
      publicationDate: publicationDate as ManipulateType | undefined,
      modality: (modality?.split(',') || []) as Modality[],
      source: source?.split(',') || [],
      search,
    };
    return this.jobsRepo.getJobs(data);
  }
}
