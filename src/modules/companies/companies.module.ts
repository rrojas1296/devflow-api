import { Module } from '@nestjs/common';
import { GetCompaniesByNamesUseCase } from './application/use-cases/get-companies-by-names';
import { COMPANIES_REPOSITORY } from './domain/tokens/companies.tokens';
import { CompaniesRepository } from './infrastructure/repositories/companies.repository';
import { DrizzleModule } from 'src/infrastructure/database/drizzle/drizzle.module';
import { BulkCompaniesUseCase } from './application/use-cases/bulk-companies.use-case';
import { GetCompaniesUseCase } from './application/use-cases/get-companies.use-case';

@Module({
  imports: [DrizzleModule],
  providers: [
    GetCompaniesByNamesUseCase,
    GetCompaniesUseCase,
    BulkCompaniesUseCase,
    {
      provide: COMPANIES_REPOSITORY,
      useClass: CompaniesRepository,
    },
  ],
  exports: [
    GetCompaniesByNamesUseCase,
    BulkCompaniesUseCase,
    GetCompaniesUseCase,
    COMPANIES_REPOSITORY,
  ],
})
export class CompaniesModule {}
