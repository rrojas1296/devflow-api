import { ManipulateType } from 'dayjs';
import { JobCreateInput, JobEntity } from '../entities/job.entity';
import { Modality } from '../enums/modality.enum';

export interface IJobsRepository {
  getJobs(
    location: string,
    technologies: string[],
    publicationDate: ManipulateType | 'all',
    modality: Modality | 'all',
    search?: string,
  ): Promise<JobEntity[]>;
  getJobsByIds(ids: string[]): Promise<JobEntity[]>;
  createJob(data: JobCreateInput): Promise<JobEntity>;
  bulkJobs(data: JobCreateInput[]): Promise<JobEntity[]>;
}
