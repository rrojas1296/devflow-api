import { Inject, Injectable } from '@nestjs/common';
import type { IImageStorage } from 'src/infrastructure/cloudinary/cloudinary-service.interface';
import { IMAGE_STORAGE } from 'src/infrastructure/cloudinary/cloudinary.tokens';
import { COMPANIES_REPOSITORY } from 'src/modules/companies/domain/tokens/companies.tokens';
import type { CompaniesRepositoryPort } from 'src/modules/companies/domain/ports/companies-repository.port';
import { CompanyCreateInput } from 'src/modules/companies/domain/entities/companies.entity';
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
    const names = newJobs.map((nj) => nj.companyName);
    const existingCompaniesDB =
      await this.companiesRepo.getCompaniesByNames(names);

    const companiesToCreate: CompanyCreateInput[] = newJobs
      .map((nj): CompanyCreateInput | undefined => {
        const c = existingCompaniesDB.find((c) => c.name === nj.companyName);
        if (c) return undefined;
        return {
          name: nj.companyName,
          imageUrl: nj.imageUrl,
          description: null,
        };
      })
      .filter((c): c is CompanyCreateInput => c !== undefined);

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
