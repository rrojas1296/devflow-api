import { Modality } from 'src/modules/jobs/domain/enums/modality.enum';
import { Source } from 'src/modules/jobs/domain/enums/source.enum';

export interface ScraperJobsInput {
  source: Source;
  keywords: string;
  modality: Modality[];
}
