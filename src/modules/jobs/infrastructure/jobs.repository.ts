import { Inject, Injectable } from '@nestjs/common';
import { type DrizzleDB } from 'src/infrastructure/database/drizzle/types/drizzle.types';
import { and, arrayOverlaps, eq, gte, ilike, inArray, SQL } from 'drizzle-orm';
import { jobs } from 'src/infrastructure/database/drizzle/schemas';
import { JobCreateInput, JobEntity } from '../domain/entities/job.entity';
import { JobMapper } from './mappers/job.mapper';
import { IJobsRepository } from '../domain/ports/jobs-repository.port';
import { Modality } from '../domain/enums/modality.enum';
import dayjs, { ManipulateType } from 'dayjs';

@Injectable()
export class JobsRepository implements IJobsRepository {
  constructor(@Inject('DRIZZLE_DB') private db: DrizzleDB) {}

  async getJobs(
    location: string,
    technologies: string[],
    publicationDate: ManipulateType | 'all',
    modality: Modality | 'all',
    search?: string,
  ): Promise<JobEntity[]> {
    const conditions: SQL[] = [];
    if (search) {
      conditions.push(ilike(jobs.title, `%${search}%`));
    }

    if (location !== 'all') {
      conditions.push(ilike(jobs.location, `%${location}%`));
    }
    if (modality !== 'all') {
      conditions.push(eq(jobs.modality, modality));
    }

    if (technologies.length && !technologies.includes('all')) {
      conditions.push(arrayOverlaps(jobs.stack, technologies));
    }

    if (publicationDate !== 'all') {
      const fromDate = dayjs().subtract(1, publicationDate).toDate();
      conditions.push(gte(jobs.postedDate, fromDate));
    }

    return this.db
      .select()
      .from(jobs)
      .where(and(...conditions));
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
