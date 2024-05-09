import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const IsAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const isAdmin: number = ctx.switchToHttp().getRequest().user.isAdmin;

    return isAdmin;
  },
);
