import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  country: string;
  @IsNotEmpty()
  @MinLength(6, { message: 'Password Length min 6 char' })
  password: string;
  @IsNotEmpty()
  @IsNotEmpty()
  industry: string;
}
