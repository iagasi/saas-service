import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  country: string;
  @IsNotEmpty()
  @MinLength(6, { message: 'Password Length min 6 char' })
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsNotEmpty()
  @IsString()
  industry: string;
}
