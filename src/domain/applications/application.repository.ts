import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../../core/data/database/entities/application.entity';
import { BaseRepository } from '../../core/settings/base/repository/base.repository';

@Injectable()
export class ApplicationRepository extends BaseRepository<Application> {
  constructor(
    @InjectRepository(Application)
    applicationRepository: Repository<Application>,
  ) {
    super(applicationRepository);
  }
}
