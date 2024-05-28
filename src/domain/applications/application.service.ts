import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/settings/base/service/base.service';
import { Application } from 'src/core/data/database/entities/application.entity';
import { ApplicationRepository } from './application.repository';

@Injectable()
export class ApplicationService extends BaseService<
  ApplicationRepository,
  Application
> {
  constructor(private readonly applicationRepository: ApplicationRepository) {
    super(applicationRepository);
  }
}
