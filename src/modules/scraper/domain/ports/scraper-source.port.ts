import { SourceJobResult } from '../interfaces/source-job-result.interface';
import { ScrapeRequest } from './scraper-producer.port';

export interface IScraperSource {
  key: string;
  fetch(data: ScrapeRequest): Promise<SourceJobResult[]>;
}
