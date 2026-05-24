import { Module, Provider } from '@nestjs/common';
import { JobsRepository } from './infrastructure/jobs.repository';
import { JobsController } from './presentation/jobs.controller';
import { GetJobsUseCase } from './application/use-cases/get-jobs.use-case';
import { CreateJobUseCase } from './application/use-cases/create-job.use-case';
import { QueueModule } from 'src/infrastructure/bullmq/bullmq.module';
import { DrizzleModule } from 'src/infrastructure/database/drizzle/drizzle.module';
import { GetJobsByIdUseCase } from './application/use-cases/get-jobs-by-id.use-case-';
import { BulkJobsUseCase } from './application/use-cases/bulk-jobs.use-case-';
import { JOBS_REPOSITORY } from './domain/tokens/jobs.tokens';

const USE_CASES: Provider[] = [
  CreateJobUseCase,
  GetJobsUseCase,
  GetJobsByIdUseCase,
  BulkJobsUseCase,
];
const REPOSITORIES: Provider[] = [
  {
    provide: JOBS_REPOSITORY,
    useClass: JobsRepository,
  },
];

@Module({
  imports: [DrizzleModule, QueueModule],
  controllers: [JobsController],
  providers: [...USE_CASES, ...REPOSITORIES],
  exports: [GetJobsByIdUseCase, BulkJobsUseCase],
})
export class JobsModule {}
