export interface SourceJobResult {
  title: string;
  description: string;
  companyName: string;
  location: string;
  externalId: string;
  stack: string[];
  imageUrl: string | null;
  modality: string;
  linkUrl: string;
  source: string;
  postedDate: Date;
}
