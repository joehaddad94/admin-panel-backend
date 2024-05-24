import { BaseService } from '@core/settings/base/service/base.service';
import { Injectable } from '@nestjs/common';
import { User } from '@core/data/database';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends BaseService<UserRepository, User> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }
}
