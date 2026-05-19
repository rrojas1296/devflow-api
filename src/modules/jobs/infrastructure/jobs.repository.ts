import { Inject, Injectable } from '@nestjs/common';
import {
  Job,
  jobs,
  JobsCreateInput,
} from 'src/infrastructure/database/drizzle/schemas/jobs.schema';
import { type DrizzleDB } from 'src/infrastructure/database/drizzle/types/drizzle.types';
import { IJobsRepository } from '../domain/jobs-repository.interface';
import { desc, inArray } from 'drizzle-orm';

@Injectable()
export class JobsRepository implements IJobsRepository {
  constructor(@Inject('DRIZZLE_DB') private db: DrizzleDB) {}

  async getJobs(): Promise<Job[]> {
    const data = await this.db
      .select()
      .from(jobs)
      .orderBy(desc(jobs.postedDate));
    return data;
  }

  async getJobsById(ids: string[]) {
    return this.db
      .select({
        id: jobs.id,
        externalId: jobs.externalId,
      })
      .from(jobs)
      .where(inArray(jobs.externalId, ids));
  }

  async createJob(data: JobsCreateInput): Promise<Job> {
    const [newJob] = await this.db.insert(jobs).values(data).returning();
    return newJob;
  }

  async bulkJobs(data: JobsCreateInput[]): Promise<Job[]> {
    const newJobs = await this.db.insert(jobs).values(data).returning();
    return newJobs;
  }
}
