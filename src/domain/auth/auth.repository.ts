import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '@core/data/database';
import { BaseRepository } from '@core/settings/base/repository/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository extends BaseRepository<Admin> {
  constructor(@InjectRepository(Admin) authRepository: Repository<Admin>) {
    super(authRepository);
  }
}
