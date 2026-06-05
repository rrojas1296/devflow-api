import { CompanyEntity } from 'src/modules/companies/domain/entities/companies.entity';
import { SourceJobResult } from '../interfaces/source-job-result.interface';

export interface ICompanyProcessor {
  execute(jobs: SourceJobResult[]): Promise<CompanyEntity[]>;
}

export const COMPANY_PROCESSOR = 'ICompanyProcessor';
