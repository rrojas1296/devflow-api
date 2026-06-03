import { Inject, Injectable } from '@nestjs/common';
import { type DrizzleDB } from 'src/infrastructure/database/drizzle/types/drizzle.types';
import { and, desc, gte, ilike, inArray, sql, SQL } from 'drizzle-orm';
import { jobs } from 'src/infrastructure/database/drizzle/schemas';
import { JobCreateInput, JobEntity } from '../domain/entities/job.entity';
import { JobMapper } from './mappers/job.mapper';
import { IJobsRepository } from '../domain/ports/jobs-repository.port';
import { Modality } from '../domain/enums/modality.enum';
import dayjs, { ManipulateType } from 'dayjs';

@Injectable()
export class JobsRepository implements IJobsRepository {
  constructor(@Inject('DRIZZLE_DB') private db: DrizzleDB) {}

  async getJobs(data: {
    location: string[];
    technologies: string[];
    publicationDate?: ManipulateType;
    modality: Modality[];
    source: string[];
    search?: string;
  }): Promise<JobEntity[]> {
    const {
      search,
      location,
      modality,
      technologies,
      publicationDate,
      source,
    } = data;
    const conditions: SQL[] = [];
    if (search) {
      conditions.push(ilike(jobs.title, `%${search}%`));
    }

    if (location.length > 0) {
      conditions.push(inArray(jobs.location, location));
    }
    if (modality.length > 0) {
      conditions.push(inArray(jobs.modality, modality));
    }

    if (technologies.length > 0) {
      conditions.push(
        sql`${jobs.stack} @> ARRAY[${sql.join(
          technologies.map((t) => sql`${t}`),
          sql`, `,
        )}]::text[]`,
      );
    }

    if (source.length > 0) {
      conditions.push(inArray(jobs.source, source));
    }

    if (publicationDate) {
      const fromDate = dayjs().subtract(1, publicationDate).toDate();
      conditions.push(gte(jobs.postedDate, fromDate));
    }

    return this.db
      .select()
      .from(jobs)
      .where(and(...conditions))
      .orderBy(desc(jobs.postedDate));
  }

  async getLocations(): Promise<string[]> {
    const data = await this.db
      .selectDistinct({ location: jobs.location })
      .from(jobs);
    return data.map((d) => d.location);
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
