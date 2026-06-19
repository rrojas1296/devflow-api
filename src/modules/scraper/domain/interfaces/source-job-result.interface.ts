import { Modality } from 'src/modules/jobs/domain/enums/modality.enum';

export interface SourceJobResult {
  title: string;
  description: string;
  companyName: string;
  location: string;
  externalId: string;
  stack: string[];
  imageUrl: string | null;
  modality: Modality;
  linkUrl: string;
  source: string;
  postedDate: Date;
}
