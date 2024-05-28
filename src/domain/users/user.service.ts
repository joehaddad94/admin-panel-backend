import { BaseService } from 'src/core/settings/base/service/base.service';
import { Injectable } from '@nestjs/common';
import { User } from 'src/core/data/database';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends BaseService<UserRepository, User> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }
}
