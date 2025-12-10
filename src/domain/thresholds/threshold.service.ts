import { Injectable } from '@nestjs/common';
import { Threshold } from 'src/core/data/database/entities/threshold.entity';
import { BaseService } from 'src/core/settings/base/service/base.service';
import { ThresholdRepository } from './threshold.repository';

@Injectable()
export class ThresholdService extends BaseService<
  ThresholdRepository,
  Threshold
> {
  constructor(private readonly thresholdRepository: ThresholdRepository) {
    super(thresholdRepository);
  }
}
