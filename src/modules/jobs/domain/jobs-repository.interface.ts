import { Job } from 'src/infrastructure/database/drizzle/schemas';

export interface IJobsRepository {
  getJobs(): Promise<Job[]>;
  createJob(data: Job): Promise<Job>;
}
