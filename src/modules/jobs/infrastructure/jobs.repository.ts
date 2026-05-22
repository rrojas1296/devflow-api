import { Inject, Injectable } from '@nestjs/common';
import { type DrizzleDB } from 'src/infrastructure/database/drizzle/types/drizzle.types';
import { desc, inArray } from 'drizzle-orm';
import { jobs } from 'src/infrastructure/database/drizzle/schemas';
import { IJobsRepository } from '../domain/interfaces/jobs-repository.interface';
import { JobCreateInput, JobEntity } from '../domain/entities/job.entity';

@Injectable()
export class JobsRepository implements IJobsRepository {
  constructor(@Inject('DRIZZLE_DB') private db: DrizzleDB) {}

  async getJobs(): Promise<JobEntity[]> {
    const data = await this.db
      .select()
      .from(jobs)
      .orderBy(desc(jobs.postedDate));
    return data;
  }

  async getJobsByIds(ids: string[]) {
    return this.db
      .select({
        id: jobs.id,
        externalId: jobs.externalId,
      })
      .from(jobs)
      .where(inArray(jobs.externalId, ids));
  }

  async createJob(data: JobCreateInput): Promise<JobEntity> {
    const [newJob] = await this.db.insert(jobs).values(data).returning();
    return newJob;
  }

  async bulkJobs(data: JobCreateInput[]): Promise<JobEntity[]> {
    const newJobs = await this.db.insert(jobs).values(data).returning();
    return newJobs;
  }
}
