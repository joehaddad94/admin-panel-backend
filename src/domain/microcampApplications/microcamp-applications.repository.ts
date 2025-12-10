import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MicrocampApplication } from 'src/core/data/database/entities/microcamp-application.entity';
import { BaseRepository } from 'src/core/settings/base/repository/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class MicrocampApplicationRepository extends BaseRepository<MicrocampApplication> {
  constructor(
    @InjectRepository(MicrocampApplication)
    microcampApplicationRepository: Repository<MicrocampApplication>,
  ) {
    super(microcampApplicationRepository);
  }
}
