import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';
export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  gsc: number;

  @IsString()
  viewId: String;

  @IsString()
  url: String;

  @IsString()
  image: String;

  @IsString()
  accuDomain: String;

  @IsString()
  accountId: String;

  @IsString()
  createdBy: String;

  @IsBoolean()
  ga: boolean;

  @IsBoolean()
  accuranker: boolean;

  @IsString()
  property: string;
}
