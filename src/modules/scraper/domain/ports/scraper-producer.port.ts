export interface ScrapeRequest {
  source: string;
  keywords: string;
  modality: string[];
}

export interface IScraperProducer {
  scrapeJobs(data: ScrapeRequest): Promise<void>;
}
