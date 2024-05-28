import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { BaseService } from '../../core/settings/base/service/base.service';
import { User } from '../../core/data/database';

@Injectable()
export class UserService extends BaseService<UserRepository, User> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }
}
