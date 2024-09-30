import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/settings/base/service/base.service';
import { CycleRepository } from './cycle.repository';
import { Cycles } from 'src/core/data/database/entities/cycle.entity';

@Injectable()
export class CycleService extends BaseService<CycleRepository, Cycles> {
  constructor(private readonly cycleRepository: CycleRepository) {
    super(cycleRepository);
  }
}
