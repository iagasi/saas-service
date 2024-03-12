import { IsNotEmpty, MinLength } from 'class-validator';

export class ActivateEmployeeDto {
  @MinLength(6, { message: 'Password Length min 6 char' })
  @IsNotEmpty()
  password: string;
}
