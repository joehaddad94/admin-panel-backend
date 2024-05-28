import { Injectable } from '@nestjs/common';
import { InformationRepository } from './information.repository';
import { Information } from '../../core/data/database/entities/information.entity';
import { BaseService } from '../../core/settings/base/service/base.service';

@Injectable()
export class InformationService extends BaseService<
  InformationRepository,
  Information
> {
  constructor(private readonly informationRepository: InformationRepository) {
    super(informationRepository);
  }
}
