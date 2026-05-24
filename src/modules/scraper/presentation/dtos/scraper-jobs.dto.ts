import { IsArray, IsString } from 'class-validator';
import type { Modality } from 'src/modules/jobs/domain/enums/modality.enum';
import type { Source } from 'src/modules/jobs/domain/enums/source.enum';

export class ScraperDto {
  @IsString()
  source: Source;

  @IsArray()
  @IsString({ each: true })
  modality: Modality[];

  @IsString()
  keywords: string;
}
