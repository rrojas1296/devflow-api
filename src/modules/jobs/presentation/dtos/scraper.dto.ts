import { IsArray, IsString } from 'class-validator';

export class ScraperDto {
  @IsString()
  source: string;

  @IsArray()
  @IsString({ each: true })
  modality: string[];

  @IsString()
  keywords: string;
}
