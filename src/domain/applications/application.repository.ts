import { Application } from 'src/core/data/database/entities/application.entity';
import { BaseRepository } from 'src/core/settings/base/repository/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ApplicationRepository extends BaseRepository<Application> {
  constructor(
    @InjectRepository(Application)
    applicationRepository: Repository<Application>,
  ) {
    super(applicationRepository);
  }
}
