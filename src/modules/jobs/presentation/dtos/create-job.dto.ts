import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import type { Modality } from 'src/modules/jobs/domain/enums/modality.enum';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  companyName: string;

  @IsString()
  location: string;

  @IsArray()
  @IsString({ each: true })
  stack: string[];

  @IsString()
  @IsOptional()
  imageUrl: string | null;

  @IsString()
  linkUrl: string;

  @IsString()
  modality: Modality;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;

  @IsString()
  postedDate: Date;

  @IsString()
  externalId: string;

  @IsString()
  source: string;
}
