import {
  JobCreateInput,
  JobEntity,
  JobCompany,
} from '../../domain/entities/job.entity';
import { jobs } from 'src/infrastructure/database/drizzle/schemas';
import { Modality } from '../../domain/enums/modality.enum';

export interface KnexJobRaw {
  id: string;
  title: string;
  description: string;
  location: string;
  stack: string[];
  isDeleted: boolean;
  modality: Modality;
  externalId: string;
  postedDate: string | Date;
  source: string;
  linkUrl: string | null;
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
  deletedAt: string | Date | null;
  companyId: string;
  company: string | JobCompany | null;
}

export class JobMapper {
  static toDomain(raw: typeof jobs.$inferSelect): JobEntity {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      location: raw.location,
      stack: raw.stack,
      isDeleted: raw.isDeleted,
      modality: raw.modality,
      externalId: raw.externalId,
      postedDate: raw.postedDate,
      source: raw.source,
      linkUrl: raw.linkUrl,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      companyId: raw.companyId,
    };
  }

  static fromKnexRaw(raw: KnexJobRaw): JobEntity {
    const company: JobCompany | undefined = raw.company
      ? typeof raw.company === 'string'
        ? (JSON.parse(raw.company) as JobCompany)
        : raw.company
      : undefined;

    return {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      location: raw.location,
      stack: raw.stack,
      isDeleted: raw.isDeleted,
      modality: raw.modality,
      externalId: raw.externalId,
      postedDate: raw.postedDate ? new Date(raw.postedDate) : new Date(),
      source: raw.source,
      linkUrl: raw.linkUrl,
      createdAt: raw.createdAt ? new Date(raw.createdAt) : null,
      updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : null,
      deletedAt: raw.deletedAt ? new Date(raw.deletedAt) : null,
      companyId: raw.companyId || company?.id || '',
      company,
    };
  }

  static toPersistence(entity: JobEntity): JobCreateInput {
    return {
      title: entity.title,
      description: entity.description,
      location: entity.location,
      stack: entity.stack,
      modality: entity.modality,
      externalId: entity.externalId,
      postedDate: entity.postedDate,
      source: entity.source,
      linkUrl: entity.linkUrl,
      companyId: entity.companyId,
    };
  }
}
