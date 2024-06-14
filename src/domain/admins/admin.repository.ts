import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/settings/base/repository/base.repository';
import { Admin } from '../../core/data/database';

@Injectable()
export class AdminRepository extends BaseRepository<Admin> {
  constructor(@InjectRepository(Admin) adminRepository: Repository<Admin>) {
    super(adminRepository);
  }
}
