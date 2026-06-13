import { ManipulateType } from 'dayjs';
import { JobCreateInput, JobEntity } from '../entities/job.entity';
import { Modality } from '../enums/modality.enum';

export interface IJobsRepository {
  getJobs(data: {
    locations: string[];
    technologies: string[];
    postedDate?: ManipulateType;
    modality: Modality[];
    source: string[];
    search?: string;
    page?: string;
    limit?: string;
  }): Promise<{
    jobs: JobEntity[];
    count: number;
  }>;
  getLocations(): Promise<string[]>;
  getJobsByIds(ids: string[]): Promise<JobEntity[]>;
  createJob(data: JobCreateInput): Promise<JobEntity>;
  bulkJobs(data: JobCreateInput[]): Promise<JobEntity[]>;
}
