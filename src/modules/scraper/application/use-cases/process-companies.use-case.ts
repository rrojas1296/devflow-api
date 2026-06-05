import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import type { IImageStorage } from 'src/infrastructure/cloudinary/cloudinary-service.interface';
import { IMAGE_STORAGE } from 'src/infrastructure/cloudinary/cloudinary.tokens';
import { BulkCompaniesUseCase } from 'src/modules/companies/application/use-cases/bulk-companies.use-case';
import { GetCompaniesByNamesUseCase } from 'src/modules/companies/application/use-cases/get-companies-by-names';
import { CompanyCreateInput } from 'src/modules/companies/domain/entities/companies.entity';
import { SourceJobResult } from '../../domain/interfaces/source-job-result.interface';

@Injectable()
export class ProcessCompaniesUseCase {
  constructor(
    @Inject(IMAGE_STORAGE) private readonly imageStorage: IImageStorage,
    private readonly bulkCompaniesUseCase: BulkCompaniesUseCase,
    private readonly getCompaniesByNamesUseCase: GetCompaniesByNamesUseCase,
  ) {}

  async execute(newJobs: SourceJobResult[]) {
    const names = newJobs.map((nj) => nj.companyName);
    const existingCompaniesDB =
      await this.getCompaniesByNamesUseCase.execute(names);

    const companiesToCreate: CompanyCreateInput[] = newJobs
      .map((nj) => {
        const c = existingCompaniesDB.find((c) => c.name === nj.companyName);
        if (c) return;
        return {
          name: nj.companyName,
          imageUrl: nj.imageUrl,
          description: null,
        };
      })
      .filter((c) => c !== undefined);

    const imageLength = companiesToCreate.filter(
      (ctc) => ctc.imageUrl !== null,
    );

    console.log(`=====> Uploading ${imageLength.length} images`);

    for (const company of companiesToCreate) {
      if (company.imageUrl === null) continue;
      const response = await axios.get(company.imageUrl, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          Accept: 'image/',
        },
      });
      const buffer = Buffer.from(response.data as string, 'binary');
      const { url } = await this.imageStorage.uploadStream(buffer);
      company.imageUrl = url;
    }
    console.log(`=====> Creating ${companiesToCreate.length} companies`);
    const newCompanies =
      await this.bulkCompaniesUseCase.execute(companiesToCreate);
    const companiesDB = [...existingCompaniesDB, ...newCompanies];

    return companiesDB;
  }
}
