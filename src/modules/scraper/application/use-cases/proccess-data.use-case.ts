import { Inject, Injectable } from '@nestjs/common';
import { JobCreateInput } from 'src/modules/jobs/domain/entities/job.entity';
import { BulkJobsUseCase } from 'src/modules/jobs/application/use-cases/bulk-jobs.use-case-';
import { GetJobsByIdUseCase } from 'src/modules/jobs/application/use-cases/get-jobs-by-id.use-case-';
import type { IImageStorage } from 'src/infrastructure/cloudinary/cloudinary-service.interface';
import axios from 'axios';

@Injectable()
export class ProccessDataUseCase {
  constructor(
    @Inject('IImageStorage') private readonly imageStorage: IImageStorage,
    private readonly bulkJobsUseCase: BulkJobsUseCase,
    private readonly getJobsByIdUseCase: GetJobsByIdUseCase,
  ) {}
  async execute(jobs: JobCreateInput[]) {
    const ids = jobs.map((j) => j.externalId);
    const existingJobs = await this.getJobsByIdUseCase.execute(ids);

    const newJobs = jobs.filter((j) => {
      const existingJob = existingJobs.find(
        (ej) => ej.externalId === j.externalId,
      );
      return !existingJob;
    });

    console.log(`=====> Downloading ${newJobs?.length} images`);
    for (const job of newJobs) {
      if (job.imageUrl) {
        try {
          const response = await axios.get(job.imageUrl, {
            responseType: 'arraybuffer',
            headers: {
              'User-Agent':
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
              Accept: 'image/',
            },
          });
          const buffer = Buffer.from(response.data as string, 'binary');
          const { url } = await this.imageStorage.uploadStream(buffer);
          job.imageUrl = url ? url : null;
        } catch (err) {
          console.error('=====> IMAGE DOWNLOAD ERROR', (err as Error).message);
          job.imageUrl = null;
        }
      }
    }

    console.log(`=====> Inserting ${newJobs?.length} jobs`);
    await this.bulkJobsUseCase.execute(newJobs);
    console.log(`=====> Finished : ${newJobs?.length} jobs inserted`);

    return { inserted: newJobs.length };
  }
}
