import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { ICompanyDb } from 'src/interfaces/company';
export const AdminOnly = createParamDecorator(
  (data: keyof ICompanyDb, ctx: ExecutionContext) => {
    const request: any = ctx.switchToHttp().getRequest();

    const user: ICompanyDb = request.user;
    console.log(user);

    if (user.role! == 'ADMIN') {
      throw new BadRequestException('Company Admin Only!!!');
    }

    return true;
  },
);
