import { CompanyEntity } from 'src/modules/companies/domain/entities/companies.entity';

export interface JobEntity {
  id: string;
  title: string;
  description: string;
  location: string;
  stack: string[];
  isDeleted: boolean;
  modality: 'onsite' | 'remote' | 'hybrid';
  externalId: string;
  postedDate: Date;
  source: string;
  companyId: string;
  linkUrl: string | null;
  company?: CompanyEntity;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export type JobCreateInput = Omit<
  JobEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'
>;
