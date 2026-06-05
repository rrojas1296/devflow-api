import { Injectable } from '@nestjs/common';
import { BulkJobsUseCase } from 'src/modules/jobs/application/use-cases/bulk-jobs.use-case-';
import { GetJobsByIdUseCase } from 'src/modules/jobs/application/use-cases/get-jobs-by-id.use-case-';
import { ProcessCompaniesUseCase } from './process-companies.use-case';
import { SourceJobResult } from '../../domain/interfaces/source-job-result.interface';
import { JobCreateInput } from 'src/modules/jobs/domain/entities/job.entity';
import { Modality } from 'src/modules/jobs/domain/enums/modality.enum';

@Injectable()
export class ProccessDataUseCase {
  constructor(
    private readonly bulkJobsUseCase: BulkJobsUseCase,
    private readonly getJobsByIdUseCase: GetJobsByIdUseCase,
    private readonly processCompaniesUseCase: ProcessCompaniesUseCase,
  ) {}
  async execute(jobs: SourceJobResult[]) {
    const ids = jobs.map((j) => j.externalId);
    const existingJobs = await this.getJobsByIdUseCase.execute(ids);
    const newJobs = jobs.filter((j) => {
      const existingJob = existingJobs.find(
        (ej) => ej.externalId === j.externalId,
      );
      return !existingJob;
    });

    const companiesDB = await this.processCompaniesUseCase.execute(newJobs);

    const jobsToInsert: JobCreateInput[] = newJobs
      .map((nj) => {
        const company = companiesDB.find((cp) => cp.name === nj.companyName);
        if (!company) return;
        return {
          ...nj,
          modality: nj.modality as Modality,
          imageUrl: company.imageUrl,
          companyId: company.id,
        };
      })
      .filter((d) => d !== undefined);

    console.log(`=====> Inserting ${newJobs?.length} jobs`);
    await this.bulkJobsUseCase.execute(jobsToInsert);
    console.log(`=====> Finished : ${newJobs?.length} jobs inserted`);

    return { inserted: newJobs.length };
  }
}
