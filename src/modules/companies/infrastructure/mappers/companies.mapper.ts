import { companies } from 'src/infrastructure/database/drizzle/schemas';
import {
  CompanyCreateInput,
  CompanyEntity,
} from '../../domain/entities/companies.entity';

export class CompanyMapper {
  static toDomain(raw: typeof companies.$inferSelect): CompanyEntity {
    return {
      id: raw.id,
      name: raw.name,
      description: raw.description,
      imageUrl: raw.imageUrl,
      isDeleted: raw.isDeleted,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    };
  }

  static toPersistence(entity: CompanyEntity): CompanyCreateInput {
    return {
      name: entity.name,
      description: entity.description,
      imageUrl: entity.imageUrl,
    };
  }
}
