import { JobEntity } from '../entities/job.entity';

export interface IJobsRepository {
  getJobs(): Promise<JobEntity[]>;
  getJobsByIds(ids: string[]): Promise<{ id: string; externalId: string }[]>;
  createJob(data: any): Promise<JobEntity>;
  bulkJobs(data: any): Promise<JobEntity[]>;
}
