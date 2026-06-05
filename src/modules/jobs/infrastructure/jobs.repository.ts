import { Inject, Injectable } from '@nestjs/common';
import { type DrizzleDB } from 'src/infrastructure/database/drizzle/types/drizzle.types';
import { inArray } from 'drizzle-orm';
import { jobs } from 'src/infrastructure/database/drizzle/schemas';
import { JobCreateInput, JobEntity } from '../domain/entities/job.entity';
import { JobMapper } from './mappers/job.mapper';
import { IJobsRepository } from '../domain/ports/jobs-repository.port';
import { Modality } from '../domain/enums/modality.enum';
import dayjs, { ManipulateType } from 'dayjs';
import { DRIZZLE_TOKEN } from 'src/infrastructure/database/drizzle/tokens/drizzle.tokens';
import { KNEX_SERVICE } from 'src/infrastructure/database/knex/knex.tokens';
import { KnexService } from 'src/infrastructure/database/knex/knex.service';

@Injectable()
export class JobsRepository implements IJobsRepository {
  constructor(
    @Inject(DRIZZLE_TOKEN) private db: DrizzleDB,
    @Inject(KNEX_SERVICE) private knex: KnexService,
  ) {}

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
    const query = this.knex
      .db('jobs as j')
      .select(
        'j.id',
        'j.title',
        'j.description',
        'j.location',
        'j.stack',
        'j.is_deleted as isDeleted',
        'j.modality',
        'j.external_id as externalId',
        'j.posted_date as postedDate',
        'j.source',
        'j.link_url as linkUrl',
        'j.created_at as createdAt',
        'j.updated_at as updatedAt',
        'j.deleted_at as deletedAt',
        'c.name as companyName',
        'c.image_url as imageUrl',
        this.knex.db.raw(
          `json_build_object(
            'id', c.id,
            'name', c.name,
            'imageUrl', c.image_url
          ) as company`,
        ),
      )
      .join('companies as c', 'c.id', 'j.company_id');
    if (search) {
      query.andWhere('j.title', 'ilike', `%${search}%`);
    }

    if (location && location.length > 0) {
      query.andWhere('j.location', 'in', location);
    }

    if (modality && modality.length > 0) {
      query.andWhere('j.modality', 'in', modality);
    }

    if (technologies && technologies.length > 0) {
      query.andWhereRaw('j.stack @> ?::text[]', [technologies]);
    }

    if (source && source.length > 0) {
      query.andWhere('j.source', 'in', source);
    }

    if (publicationDate) {
      const date = dayjs().subtract(1, publicationDate);
      query.andWhere('j.posted_date', '>=', date.toDate());
    }
    const dataDB = await query;

    return dataDB as JobEntity[];
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
