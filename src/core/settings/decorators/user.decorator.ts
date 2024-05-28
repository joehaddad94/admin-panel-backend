import { User as UserEntity } from 'src/core/data/database/entities/user.entity';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator<UserEntity>(
  (_, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();

    return request.user as UserEntity;
  },
);
