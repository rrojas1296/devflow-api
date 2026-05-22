export interface JobEntity {
  id: string;
  title: string;
  description: string;
  companyName: string;
  location: string;
  stack: string[];
  isDeleted: boolean;
  imageUrl: string | null;
  modality: 'onsite' | 'remote' | 'hybrid';
  externalId: string;
  postedDate: Date;
  source: string;
  linkUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export type JobCreateInput = Omit<
  JobEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'
>;
