import { Admin as AdminEntity } from 'typeorm';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetAdmin = createParamDecorator<AdminEntity>(
  (_, ctx: ExecutionContext): AdminEntity => {
    const request = ctx.switchToHttp().getRequest();

    return request.admin as AdminEntity;
  },
);
