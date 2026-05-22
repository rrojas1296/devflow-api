import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JobsRepository } from '../jobs.repository';
import axios from 'axios';
import { WithImplicitCoercion } from 'buffer';
import { JOBS_QUEUE } from 'src/infrastructure/bullmq/bullmq.config';
import { CloudinaryService } from 'src/infrastructure/cloudinary/cloudinary.service';
import { ScraperJobsCommand } from '../../application/commands/scrape-jobs.command';
import { ScraperService } from '../../application/services/scraper.service';

@Processor(JOBS_QUEUE)
export class JobsProcessor extends WorkerHost {
  constructor(
    private readonly scraper: ScraperService,
    private readonly repository: JobsRepository,
    private readonly cloudinary: CloudinaryService,
  ) {
    super();
  }

  async process(job: Job<ScraperJobsCommand>) {
    try {
      const jobs = await this.scraper.scrape(job.data);
      console.log(`=====> FETCHED ${jobs?.length} JOBS`);

      const ids = jobs.map((j) => j.externalId);
      const existingJobs = await this.repository.getJobsByIds(ids);

      const newJobs = jobs.filter((j) => {
        const existingJob = existingJobs.find(
          (ej) => ej.externalId === j.externalId,
        );
        return !existingJob;
      });

      console.log(`=====> DOWNLOADING ${newJobs?.length} IMAGES`);
      for (const job of newJobs) {
        if (job.imageUrl) {
          const response = await axios.get(job.imageUrl, {
            responseType: 'arraybuffer',
            headers: {
              'User-Agent':
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
              Accept: 'image/',
            },
          });
          const buffer = Buffer.from(
            response.data as WithImplicitCoercion<string>,
            'binary',
          );
          const { url } = await this.cloudinary.uploadStream(buffer);
          job.imageUrl = url ? url : null;
        }
      }
      console.log(`=====> INSERTING ${newJobs?.length} JOBS`);

      await this.repository.bulkJobs(newJobs);
      console.log(`=====> FINISHED : ${newJobs?.length} JOBS INSERTED`);
      return { insetrted: jobs?.length };
    } catch (error) {
      console.log(error);
    }
  }
}
