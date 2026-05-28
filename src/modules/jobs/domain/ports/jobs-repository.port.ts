import { JobCreateInput, JobEntity } from '../entities/job.entity';

export interface IJobsRepository {
  getJobs(): Promise<JobEntity[]>;
  getJobsByIds(ids: string[]): Promise<JobEntity[]>;
  createJob(data: JobCreateInput): Promise<JobEntity>;
  bulkJobs(data: JobCreateInput[]): Promise<JobEntity[]>;
}
