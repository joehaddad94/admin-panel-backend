import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { catcher } from 'src/core/helpers/operation';
import { throwNotFound } from 'src/core/settings/base/errors/errors';

@Injectable()
export class UserMediator {
  constructor(private readonly service: UserService) {}
  findUsers = async () => {
    return catcher(async () => {
      const found = await this.service.findMany({});

      throwNotFound({
        entity: 'User',
        errorCheck: !found,
      });

      return found;
    });
  };
}
