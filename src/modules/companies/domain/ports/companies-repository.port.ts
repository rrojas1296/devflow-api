import {
  CompanyCreateInput,
  CompanyEntity,
} from '../entities/companies.entity';

export interface CompaniesRepositoryPort {
  getCompaniesByNames(names: string[]): Promise<CompanyEntity[]>;
  getCompanies(): Promise<CompanyEntity[]>;
  bulkCompanies(companies: CompanyCreateInput[]): Promise<CompanyEntity[]>;
}
