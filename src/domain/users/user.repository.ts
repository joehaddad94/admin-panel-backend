import { BaseRepository } from 'src/core/settings/base/repository/base.repository';
import { Injectable } from '@nestjs/common';
import { User } from 'src/core/data/database';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@InjectRepository(User) userRepository: Repository<User>) {
    super(userRepository);
  }
}
