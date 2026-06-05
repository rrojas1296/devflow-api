import { Inject, Injectable } from '@nestjs/common';
import { COMPANIES_REPOSITORY } from '../../domain/tokens/companies.tokens';
import type { CompaniesRepositoryPort } from '../../domain/ports/companies-repository.port';

@Injectable()
export class GetCompaniesUseCase {
  constructor(
    @Inject(COMPANIES_REPOSITORY)
    private readonly companyRepo: CompaniesRepositoryPort,
  ) {}
  execute() {
    return this.companyRepo.getCompanies();
  }
}
