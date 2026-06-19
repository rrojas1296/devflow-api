import { Inject, Injectable } from '@nestjs/common';
import { JOBS_REPOSITORY } from '../../domain/tokens/jobs.tokens';
import type { IJobsRepository } from '../../domain/ports/jobs-repository.port';
import { ManipulateType } from 'dayjs';
import { Modality } from '../../domain/enums/modality.enum';

@Injectable()
export class GetJobsUseCase {
  constructor(@Inject(JOBS_REPOSITORY) private jobsRepo: IJobsRepository) {}
  execute({
    locations,
    technologies,
    postedDate,
    modality,
    source,
    search,
    page,
    limit,
    orderBy,
  }: {
    locations?: string;
    technologies?: string;
    postedDate?: string;
    modality?: string;
    source?: string;
    search?: string;
    page?: string;
    limit?: string;
    orderBy?: string;
  }) {
    const data = {
      locations: locations?.split(',') || [],
      technologies: technologies?.split(',') || [],
      postedDate: postedDate as ManipulateType | undefined,
      modality: (modality?.split(',') || []) as Modality[],
      source: source?.split(',') || [],
      search,
      page,
      limit,
      orderBy,
    };
    return this.jobsRepo.getJobs(data);
  }
}
