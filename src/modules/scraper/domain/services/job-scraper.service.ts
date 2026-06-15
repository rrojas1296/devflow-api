import type { IJobsRepository } from 'src/modules/jobs/domain/ports/jobs-repository.port';
import type { ICompanyProcessor } from '../ports/company-processor.port';
import { SourceJobResult } from '../interfaces/source-job-result.interface';
import { JobCreateInput } from 'src/modules/jobs/domain/entities/job.entity';
import { Modality } from 'src/modules/jobs/domain/enums/modality.enum';

export class JobScraperService {
  constructor(
    private readonly jobsRepo: IJobsRepository,
    private readonly companyProcessor: ICompanyProcessor,
  ) {}

  async processScrapedJobs(rawJobs: SourceJobResult[]) {
    const ids = rawJobs.map((j) => j.externalId);
    const existingJobs = await this.jobsRepo.getJobsByIds(ids);
    const existingIds = new Set(existingJobs.map((j) => j.externalId));
    const newJobs = rawJobs.filter((j) => !existingIds.has(j.externalId));

    const companiesDB = await this.companyProcessor.execute(newJobs);

    const jobsToInsert = newJobs
      .map((nj): JobCreateInput | undefined => {
        const company = companiesDB.find((cp) => cp.name === nj.companyName);
        if (!company) return;
        return {
          title: nj.title,
          description: nj.description,
          location: nj.location,
          stack: nj.stack,
          modality: nj.modality as Modality,
          externalId: nj.externalId,
          postedDate: nj.postedDate,
          source: nj.source,
          linkUrl: nj.linkUrl,
          companyId: company.id,
        };
      })
      .filter((d) => d !== undefined);

    console.log(`=====> Inserting ${newJobs?.length} jobs`);
    await this.jobsRepo.bulkJobs(jobsToInsert);
    console.log(`=====> Finished : ${newJobs?.length} jobs inserted`);

    return { inserted: newJobs.length };
  }
}
