import { Inject, Injectable } from '@nestjs/common';
import {
  Job,
  jobs,
  JobsCreateInput,
} from 'src/database/drizzle/schemas/jobs.schema';
import { type DrizzleDB } from 'src/database/drizzle/types/drizzle.types';
import { IJobsRepository } from '../domain/jobs-repository.interface';

@Injectable()
export class JobsRepository implements IJobsRepository {
  constructor(@Inject('DRIZZLE_DB') private db: DrizzleDB) {}
  async getJobs(): Promise<Job[]> {
    const data = await this.db.select().from(jobs);
    return data;
  }

  async createJob(data: JobsCreateInput): Promise<string> {
    const newJob = await this.db.insert(jobs).values(data).returning();
    return newJob[0].id;
  }
}
