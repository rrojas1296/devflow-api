import { Inject, Injectable } from '@nestjs/common';
import { COMPANIES_REPOSITORY } from '../../domain/tokens/companies.tokens';
import type { CompaniesRepositoryPort } from '../../domain/ports/companies-repository.port';

@Injectable()
export class GetCompaniesByNamesUseCase {
  constructor(
    @Inject(COMPANIES_REPOSITORY)
    private readonly companiesRepository: CompaniesRepositoryPort,
  ) {}
  execute(names: string[]) {
    return this.companiesRepository.getCompaniesByNames(names);
  }
}
