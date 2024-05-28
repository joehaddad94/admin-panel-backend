import { Injectable } from '@nestjs/common';

import { ApplicationRepository } from './application.repository';
import { BaseService } from '../../core/settings/base/service/base.service';
import { Application } from '../../core/data/database/entities/application.entity';

@Injectable()
export class ApplicationService extends BaseService<
  ApplicationRepository,
  Application
> {
  constructor(private readonly applicationRepository: ApplicationRepository) {
    super(applicationRepository);
  }
}
