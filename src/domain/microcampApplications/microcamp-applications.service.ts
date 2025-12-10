import { Injectable } from '@nestjs/common';
import { MicrocampApplication } from 'src/core/data/database/entities/microcamp-application.entity';
import { MicrocampApplicationRepository } from './microcamp-applications.repository';
import { BaseService } from 'src/core/settings/base/service/base.service';

@Injectable()
export class MicrocampApplicationService extends BaseService<
  MicrocampApplicationRepository,
  MicrocampApplication
> {
  constructor(
    private readonly microcampApplicationRepository: MicrocampApplicationRepository,
  ) {
    super(microcampApplicationRepository);
  }
}
