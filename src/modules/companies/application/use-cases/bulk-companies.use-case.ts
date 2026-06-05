import { Inject, Injectable } from '@nestjs/common';
import { CompanyCreateInput } from '../../domain/entities/companies.entity';
import { COMPANIES_REPOSITORY } from '../../domain/tokens/companies.tokens';
import type { CompaniesRepositoryPort } from '../../domain/ports/companies-repository.port';

@Injectable()
export class BulkCompaniesUseCase {
  constructor(
    @Inject(COMPANIES_REPOSITORY)
    private readonly companyRepo: CompaniesRepositoryPort,
  ) {}
  execute(data: CompanyCreateInput[]) {
    return this.companyRepo.bulkCompanies(data);
  }
}
