import { ManipulateType } from 'dayjs';
import { JobCreateInput, JobEntity } from '../entities/job.entity';
import { Modality } from '../enums/modality.enum';

export interface IJobsRepository {
  getJobs(data: {
    location: string[];
    technologies: string[];
    publicationDate?: ManipulateType;
    modality: Modality[];
    source: string[];
    search?: string;
  }): Promise<JobEntity[]>;
  getLocations(): Promise<string[]>;
  getJobsByIds(ids: string[]): Promise<JobEntity[]>;
  createJob(data: JobCreateInput): Promise<JobEntity>;
  bulkJobs(data: JobCreateInput[]): Promise<JobEntity[]>;
}
