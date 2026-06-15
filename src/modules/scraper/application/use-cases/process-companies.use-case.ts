import { Inject, Injectable } from '@nestjs/common';
import type { IImageStorage } from 'src/infrastructure/cloudinary/cloudinary-service.interface';
import { IMAGE_STORAGE } from 'src/infrastructure/cloudinary/cloudinary.tokens';
import { COMPANIES_REPOSITORY } from 'src/modules/companies/domain/tokens/companies.tokens';
import type { CompaniesRepositoryPort } from 'src/modules/companies/domain/ports/companies-repository.port';
import { HTTP_CLIENT } from '../../domain/ports/http-client.port';
import type { IHttpClient } from '../../domain/ports/http-client.port';
import { SourceJobResult } from '../../domain/interfaces/source-job-result.interface';
import type { ICompanyProcessor } from '../../domain/ports/company-processor.port';

@Injectable()
export class ProcessCompaniesUseCase implements ICompanyProcessor {
  constructor(
    @Inject(COMPANIES_REPOSITORY)
    private readonly companiesRepo: CompaniesRepositoryPort,
    @Inject(IMAGE_STORAGE)
    private readonly imageStorage: IImageStorage,
    @Inject(HTTP_CLIENT)
    private readonly httpClient: IHttpClient,
  ) {}

  async execute(newJobs: SourceJobResult[]) {
    const companies = newJobs.map((nj) => {
      return { imageUrl: nj.imageUrl, description: null, name: nj.companyName };
    });
    const nonRepeatedCompanies = Array.from(
      new Map(companies.map((item) => [item.name, item])).values(),
    );
    const existingCompaniesDB = await this.companiesRepo.getCompaniesByNames(
      nonRepeatedCompanies.map((c) => c.name),
    );

    const companiesToCreate = nonRepeatedCompanies.filter((c) => {
      const existingCompany = existingCompaniesDB.find(
        (ec) => ec.name === c.name,
      );
      return !existingCompany;
    });

    const imageLength = companiesToCreate.filter(
      (ctc) => ctc.imageUrl !== null,
    );

    console.log(`=====> Uploading ${imageLength.length} images`);

    for (const company of companiesToCreate) {
      if (company.imageUrl === null) continue;
      const buffer = await this.httpClient.getBuffer(company.imageUrl);
      const { url } = await this.imageStorage.uploadStream(buffer);
      company.imageUrl = url;
    }
    console.log(`=====> Creating ${companiesToCreate.length} companies`);
    const newCompanies =
      await this.companiesRepo.bulkCompanies(companiesToCreate);
    const companiesDB = [...existingCompaniesDB, ...newCompanies];

    return companiesDB;
  }
}
