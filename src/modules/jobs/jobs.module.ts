import { Module } from '@nestjs/common';
import { DrizzleModule } from 'src/database/drizzle/drizzle.module';
import { JobsRepository } from './infrastructure/jobs.repository';
import { JobsController } from './presentation/jobs.controller';
import { GetJobsUseCase } from './application/use-cases/get-jobs.use-case';
import { CreateJobUseCase } from './application/use-cases/create-job.use-case';

@Module({
  controllers: [JobsController],
  providers: [
    GetJobsUseCase,
    CreateJobUseCase,
    {
      provide: 'JOBS_REPOSITORY',
      useClass: JobsRepository,
    },
  ],
  imports: [DrizzleModule],
})
export class JobsModule {}
