import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Threshold } from 'src/core/data/database/entities/threshold.entity';
import { BaseRepository } from 'src/core/settings/base/repository/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class ThresholdRepository extends BaseRepository<Threshold> {
  constructor(
    @InjectRepository(Threshold)
    thresholdRepository: Repository<Threshold>,
  ) {
    super(thresholdRepository);
  }
}
