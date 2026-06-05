import { Inject, Injectable } from '@nestjs/common';
import { CompaniesRepositoryPort } from '../../domain/ports/companies-repository.port';
import type { DrizzleDB } from 'src/infrastructure/database/drizzle/types/drizzle.types';
import { companies } from 'src/infrastructure/database/drizzle/schemas/companies.schema';
import { inArray } from 'drizzle-orm';
import { DRIZZLE_TOKEN } from 'src/infrastructure/database/drizzle/tokens/drizzle.tokens';
import {
  CompanyCreateInput,
  CompanyEntity,
} from '../../domain/entities/companies.entity';
import { CompanyMapper } from '../mappers/companies.mapper';

@Injectable()
export class CompaniesRepository implements CompaniesRepositoryPort {
  constructor(@Inject(DRIZZLE_TOKEN) private db: DrizzleDB) {}
  async getCompaniesByNames(names: string[]): Promise<any> {
    return this.db
      .select()
      .from(companies)
      .where(inArray(companies.name, names));
  }

  async getCompanies(): Promise<CompanyEntity[]> {
    const data = await this.db.select().from(companies);
    return data.map((d) => CompanyMapper.toDomain(d));
  }

  async bulkCompanies(data: CompanyCreateInput[]): Promise<CompanyEntity[]> {
    const newCompanies = await this.db
      .insert(companies)
      .values(data)
      .returning();
    return newCompanies.map((nc) => CompanyMapper.toDomain(nc));
  }
}
