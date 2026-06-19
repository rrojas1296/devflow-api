import type { IJobsRepository } from 'src/modules/jobs/domain/ports/jobs-repository.port';
import type { ICompanyProcessor } from '../ports/company-processor.port';
import { SourceJobResult } from '../interfaces/source-job-result.interface';
import { JobCreateInput } from 'src/modules/jobs/domain/entities/job.entity';

export class JobScraperService {
  constructor(
    private readonly jobsRepo: IJobsRepository,
    private readonly companyProcessor: ICompanyProcessor,
  ) {}

  async processScrapedJobs(rawJobs: SourceJobResult[]) {
    const scrappedJobs = Array.from(
      new Map(rawJobs.map((job) => [job.externalId, job])).values(),
    );
    const ids = scrappedJobs.map((j) => j.externalId);

    const existingJobs = await this.jobsRepo.getJobsByIds(ids);

    const existingIds = new Set(existingJobs.map((j) => j.externalId));

    const newJobs = scrappedJobs.filter((j) => !existingIds.has(j.externalId));

    const companiesDB = await this.companyProcessor.execute(scrappedJobs);

    const jobsToInsert = scrappedJobs
      .map((nj): JobCreateInput | undefined => {
        const company = companiesDB.find((cp) => cp.name === nj.companyName);
        if (!company) return;
        return {
          ...nj,
          companyId: company.id,
        };
      })
      .filter((j) => j !== undefined);

    console.log(`=====> Inserting ${newJobs?.length} jobs`);
    await this.jobsRepo.bulkJobs(jobsToInsert);
    console.log(`=====> Finished : ${newJobs?.length} jobs inserted`);

    return { inserted: newJobs.length };
  }
}
