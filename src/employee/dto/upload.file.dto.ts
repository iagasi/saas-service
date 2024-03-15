import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  @IsString()
  companyId: string;
  @IsNotEmpty()
  @IsArray()
  access: string[];
}
