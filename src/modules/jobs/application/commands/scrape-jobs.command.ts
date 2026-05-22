import { Modality } from '../../domain/enums/modality.enum';
import { Source } from '../../domain/enums/source.enum';

export interface ScraperJobsCommand {
  source: Source;
  keywords: string;
  modality: Modality[];
}
