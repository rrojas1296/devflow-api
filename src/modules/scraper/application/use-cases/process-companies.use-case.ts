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

  async execute(rawJobs: SourceJobResult[]) {
    const companies = Array.from(
      new Map(
        rawJobs.map((nj) => {
          return [
            nj.companyName,
            {
              imageUrl: nj.imageUrl,
              description: null,
              name: nj.companyName,
            },
          ];
        }),
      ).values(),
    );
    const existingCompanies = await this.companiesRepo.getCompaniesByNames(
      companies.map((c) => c.name),
    );

    const existingNames = new Set(existingCompanies.map((c) => c.name));

    const companiesToInsert = companies.filter(
      (c) => !existingNames.has(c.name),
    );

    const imageLength = companiesToInsert.filter(
      (ctc) => ctc.imageUrl !== null,
    ).length;

    console.log(`=====> Uploading ${imageLength} images`);

    for (const company of companiesToInsert) {
      if (company.imageUrl === null) continue;
      const buffer = await this.httpClient.getBuffer(company.imageUrl);
      const { url } = await this.imageStorage.uploadStream(buffer);
      company.imageUrl = url;
    }
    console.log(`=====> Creating ${companiesToInsert.length} companies`);
    const newCompanies =
      await this.companiesRepo.bulkCompanies(companiesToInsert);
    const companiesDB = [...existingCompanies, ...newCompanies];

    return companiesDB;
  }
}
