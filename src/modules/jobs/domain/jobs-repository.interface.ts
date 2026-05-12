import { Job, JobsCreateInput } from 'src/database/drizzle/schemas/jobs.schema';

export interface IJobsRepository {
  getJobs(): Promise<Job[]>;
  createJob(data: JobsCreateInput): Promise<string>;
}
