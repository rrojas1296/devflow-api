export interface CompanyEntity {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isDeleted: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export type CompanyCreateInput = Omit<
  CompanyEntity,
  'id' | 'isDeleted' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
