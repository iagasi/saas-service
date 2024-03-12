import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request: any = ctx.switchToHttp().getRequest();
    if (!data.active) {
      throw new UnauthorizedException('Accaunt not activated check email');
    }
    const user = request.user;
    return data ? user[data] : user;
  },
);
