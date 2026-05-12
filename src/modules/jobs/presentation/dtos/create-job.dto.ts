import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { type JobModality } from 'src/database/drizzle/schemas';

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
  imageUrl?: string;

  @IsString()
  linkUrl: string;

  @IsString()
  modality: JobModality;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}
