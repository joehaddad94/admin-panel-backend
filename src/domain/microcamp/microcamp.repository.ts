import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Microcamp } from 'src/core/data/database/entities/microcamp.entity';
import { BaseRepository } from 'src/core/settings/base/repository/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class MicrocampRepository extends BaseRepository<Microcamp> {
  constructor(
    @InjectRepository(Microcamp)
    microcampRepository: Repository<Microcamp>,
  ) {
    super(microcampRepository);
  }
}
