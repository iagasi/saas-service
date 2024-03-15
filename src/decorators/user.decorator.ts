import {
  BadRequestException,
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { IEmployeeDb } from 'src/interfaces/employee';

export const CurrentUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request: any = ctx.switchToHttp().getRequest();

    const user: IEmployeeDb = request.user;

    if (!user.active) {
      throw new UnauthorizedException('Account not activated check email');
    }

    if (user.role !== 'USER') {
      throw new BadRequestException('Only Employees');
    }
    return user;
  },
);
