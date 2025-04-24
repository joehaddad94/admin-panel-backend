import { Injectable } from '@nestjs/common';
import { Microcamp } from 'src/core/data/database/entities/microcamp.entity';
import { BaseService } from 'src/core/settings/base/service/base.service';
import { MicrocampRepository } from './microcamp.repository';

@Injectable()
export class MicrocampService extends BaseService<
  MicrocampRepository,
  Microcamp
> {
  constructor(private readonly microcampRepository: MicrocampRepository) {
    super(microcampRepository);
  }
}
