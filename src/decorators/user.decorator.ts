import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: keyof { role: string }, ctx: ExecutionContext) => {
    const request: any = ctx.switchToHttp().getRequest();

    const user = request.user;
    return data ? user[data] : user;
  },
);
