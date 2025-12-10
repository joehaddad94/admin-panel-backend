import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/settings/base/service/base.service';
import { DecisionDateRepository } from './decision-date.repository';
import { DecisionDates } from '../../core/data/database/entities/decision-date.entity';

@Injectable()
export class DecisionDateService extends BaseService<
  DecisionDateRepository,
  DecisionDates
> {
  constructor(private readonly decisionDateRepository: DecisionDateRepository) {
    super(decisionDateRepository);
  }
}
