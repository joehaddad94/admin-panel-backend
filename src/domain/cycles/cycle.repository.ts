import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cycles } from 'src/core/data/database/entities/cycle.entity';
import { BaseRepository } from 'src/core/settings/base/repository/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class CycleRepository extends BaseRepository<Cycles> {
  constructor(
    @InjectRepository(Cycles)
    cycleRepository: Repository<Cycles>,
  ) {
    super(cycleRepository);
  }
}
