export interface JobCompany {
  id: string;
  name: string;
  imageUrl: string | null;
}

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
  company?: JobCompany;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export type JobCreateInput = Omit<
  JobEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted' | 'company'
>;
