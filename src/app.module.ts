import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JobsModule } from './modules/jobs/jobs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CloudinaryModule } from './infrastructure/cloudinary/cloudinary.module';
import { ScraperModule } from './modules/scraper/scraper.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { KnexModule } from './infrastructure/database/knex/knex.module';

@Module({
  imports: [
    JobsModule,
    KnexModule,
    CompaniesModule,
    ScheduleModule.forRoot(),
    CloudinaryModule,
    ScraperModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
