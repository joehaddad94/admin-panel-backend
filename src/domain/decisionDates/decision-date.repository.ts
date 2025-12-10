import { Injectable } from '@nestjs/common';
import { DecisionDates } from '../../core/data/database/entities/decision-date.entity';
import { BaseRepository } from '../../core/settings/base/repository/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DecisionDateRepository extends BaseRepository<DecisionDates> {
  constructor(
    @InjectRepository(DecisionDates)
    decisionDateRepository: Repository<DecisionDates>,
  ) {
    super(decisionDateRepository);
  }
}
