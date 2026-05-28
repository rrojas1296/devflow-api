import { Inject, Injectable } from '@nestjs/common';
import { type DrizzleDB } from 'src/infrastructure/database/drizzle/types/drizzle.types';
import { desc, inArray } from 'drizzle-orm';
import { jobs } from 'src/infrastructure/database/drizzle/schemas';
import { JobCreateInput, JobEntity } from '../domain/entities/job.entity';
import { JobMapper } from './mappers/job.mapper';
import { IJobsRepository } from '../domain/ports/jobs-repository.port';

@Injectable()
export class JobsRepository implements IJobsRepository {
  constructor(@Inject('DRIZZLE_DB') private db: DrizzleDB) {}

  async getJobs(): Promise<JobEntity[]> {
    const data = await this.db
      .select()
      .from(jobs)
      .orderBy(desc(jobs.postedDate));
    return data.map((d) => JobMapper.toDomain(d));
  }

  async getJobsByIds(ids: string[]): Promise<JobEntity[]> {
    const data = await this.db
      .select()
      .from(jobs)
      .where(inArray(jobs.externalId, ids));
    return data.map((d) => JobMapper.toDomain(d));
  }

  async createJob(data: JobCreateInput): Promise<JobEntity> {
    const [newJob] = await this.db.insert(jobs).values(data).returning();
    return JobMapper.toDomain(newJob);
  }

  async bulkJobs(data: JobCreateInput[]): Promise<JobEntity[]> {
    const newJobs = await this.db.insert(jobs).values(data).returning();
    return newJobs.map((d) => JobMapper.toDomain(d));
  }
}
