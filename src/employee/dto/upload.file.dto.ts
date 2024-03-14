import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  companyId: string;
  @IsNotEmpty()
  @IsArray()
  access: string[];
}
