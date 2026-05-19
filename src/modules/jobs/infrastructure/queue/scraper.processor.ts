import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JobsScraperService } from '../scraper/jobs-scraper.service';
import { JobsRepository } from '../jobs.repository';
import { JOBS_QUEUE } from 'src/infrastructure/queue/bullmq.config';
import { ScraperDto } from '../../presentation/dtos/scraper.dto';
import axios from 'axios';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { WithImplicitCoercion } from 'buffer';

@Processor(JOBS_QUEUE)
export class JobsProcessor extends WorkerHost {
  constructor(
    private readonly scraper: JobsScraperService,
    private readonly repository: JobsRepository,
    private readonly cloudinary: CloudinaryService,
  ) {
    super();
  }

  async process(job: Job<ScraperDto>) {
    const jobs = await this.scraper.scrape(job.data);

    const ids = jobs.map((j) => j.externalId);
    const existingJobs = await this.repository.getJobsById(ids);

    const newJobs = jobs.filter((j) => {
      const existingJob = existingJobs.find(
        (ej) => ej.externalId === j.externalId,
      );
      return !existingJob;
    });

    console.log('=====> DOWNLOADING IMAGES');
    for (const job of newJobs) {
      if (job.imageUrl) {
        const response = await axios.get(job.imageUrl, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
            Accept: 'image/',
          },
        });
        const buffer = Buffer.from(
          response.data as WithImplicitCoercion<string>,
          'binary',
        );
        const { url } = await this.cloudinary.uploadStream(buffer);
        job.imageUrl = url;
      }
    }

    await this.repository.bulkJobs(newJobs);
    console.log('=====> INSERTED', newJobs?.length);
    return { insetrted: jobs?.length };
  }
}
