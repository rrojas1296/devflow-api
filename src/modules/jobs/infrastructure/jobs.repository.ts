import { Inject, Injectable } from '@nestjs/common';
import { type DrizzleDB } from 'src/infrastructure/database/drizzle/types/drizzle.types';
import { inArray } from 'drizzle-orm';
import { jobs } from 'src/infrastructure/database/drizzle/schemas';
import { JobCreateInput, JobEntity } from '../domain/entities/job.entity';
import { JobMapper, type KnexJobRaw } from './mappers/job.mapper';
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
    locations: string[];
    technologies: string[];
    postedDate?: ManipulateType;
    modality: Modality[];
    source: string[];
    search?: string;
    page?: string;
    limit?: string;
    orderBy?: string;
  }): Promise<{
    jobs: JobEntity[];
    count: number;
  }> {
    const {
      search,
      locations,
      modality,
      technologies,
      postedDate,
      source,
      page = '1',
      limit,
      orderBy,
    } = data;

    const offset = (Number(page) - 1) * Number(limit);
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
        'j.company_id as companyId',
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
      .innerJoin('companies as c', 'c.id', 'j.company_id');
    if (search) {
      query.andWhere('j.title', 'ilike', `%${search}%`);
    }

    if (locations && locations.length > 0) {
      query.andWhere('j.location', 'in', locations);
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

    if (postedDate) {
      const date = dayjs().subtract(1, postedDate);
      query.andWhere('j.posted_date', '>=', date.toDate());
    }

    if (orderBy && orderBy === 'new') {
      query.orderBy('j.posted_date', 'desc');
    }

    if (orderBy && orderBy === 'old') {
      query.orderBy('j.posted_date', 'asc');
    }
    if (orderBy && orderBy === 'az') {
      query.orderBy('j.title', 'asc');
    }
    const countQuery = query
      .clone()
      .clearSelect()
      .clearOrder()
      .countDistinct('j.id as total');

    const countResult = await countQuery.first();
    const total = Number(countResult?.total) || 0;

    const dataDB = await query.limit(Number(limit)).offset(offset);

    return {
      jobs: (dataDB as KnexJobRaw[]).map((raw) => JobMapper.fromKnexRaw(raw)),
      count: total,
    };
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

  async getKpis(): Promise<{ total: string; added: string; sources: string }> {
    const total = await this.knex.db('jobs').count('* as total').first();
    const added = await this.knex
      .db('jobs')
      .count('* as added')
      .where('posted_date', '>=', dayjs().subtract(1, 'day').toDate())
      .first();

    const sources = await this.knex
      .db('jobs')
      .countDistinct('source as sources')
      .first();

    return {
      total: total?.total.toString() ?? '0',
      added: added?.added.toString() ?? '0',
      sources: sources?.sources.toString() ?? '0',
    };
  }

  async createJob(data: JobCreateInput): Promise<JobEntity> {
    const [newJob] = await this.db.insert(jobs).values(data).returning();
    return JobMapper.toDomain(newJob);
  }

  async bulkJobs(data: JobCreateInput[]): Promise<JobEntity[]> {
    const newJobs = await this.db
      .insert(jobs)
      .values(data)
      .onConflictDoUpdate({
        target: [jobs.externalId],
        set: {
          title: jobs.title,
          linkUrl: jobs.linkUrl,
          description: jobs.description,
          location: jobs.location,
          stack: jobs.stack,
          modality: jobs.modality,
          source: jobs.source,
          postedDate: jobs.postedDate,
        },
      })
      .returning();
    return newJobs.map((d) => JobMapper.toDomain(d));
  }
}
