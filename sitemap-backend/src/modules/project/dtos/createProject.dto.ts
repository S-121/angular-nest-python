import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';
export class CreateProjectDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  gsc: number;

  @IsString()
  viewId: string;

  @IsString()
  url: string;

  @IsString()
  image: string;

  @IsString()
  accuDomain: string;

  @IsString()
  accountId: string;

  @IsString()
  createdBy: string;

  @IsBoolean()
  ga: boolean;

  @IsBoolean()
  accuranker: boolean;

  @IsString()
  property: string;

  @IsString()
  csvFilename: string;

  @IsString()
  csv: string;
}
