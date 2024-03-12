import {
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
  createParamDecorator,
} from '@nestjs/common';
import { ICompanyDb } from 'src/interfaces/company';
export const AdminOnly = createParamDecorator(
  (data: keyof ICompanyDb, ctx: ExecutionContext) => {
    const request: any = ctx.switchToHttp().getRequest();

    const user: ICompanyDb = request.user;
    if (!user.active) {
      throw new ForbiddenException('Accaunt not activated check email');
    }

    if (user.role !== 'ADMIN') {
      throw new BadRequestException('Compansy Admin Only!!!');
    }

    return user;
  },
);
