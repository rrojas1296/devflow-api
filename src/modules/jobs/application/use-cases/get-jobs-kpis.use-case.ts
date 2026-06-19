import { Inject, Injectable } from '@nestjs/common';
import type { CompaniesRepositoryPort } from 'src/modules/companies/domain/ports/companies-repository.port';
import type { IJobsRepository } from '../../domain/ports/jobs-repository.port';
import { COMPANIES_REPOSITORY } from 'src/modules/companies/domain/tokens/companies.tokens';
import { JOBS_REPOSITORY } from '../../domain/tokens/jobs.tokens';

@Injectable()
export class GetJobsKpisUseCase {
  constructor(
    @Inject(COMPANIES_REPOSITORY)
    private readonly companiesRepo: CompaniesRepositoryPort,
    @Inject(JOBS_REPOSITORY) private readonly jobsRepo: IJobsRepository,
  ) {}
  async execute() {
    const companies = (
      await this.companiesRepo.getCompanies()
    ).length.toString();
    const { total, added, sources } = await this.jobsRepo.getKpis();
    console.log({ total, added, sources, companies });
    return {
      total,
      added,
      sources,
      companies,
    };
  }
}
