import { JobCreateInput, JobEntity } from '../../domain/entities/job.entity';
import { jobs } from 'src/infrastructure/database/drizzle/schemas';

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
