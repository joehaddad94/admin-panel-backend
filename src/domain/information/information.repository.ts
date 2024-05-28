import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/settings/base/repository/base.repository';
import { Information } from '../../core/data/database/entities/information.entity';

@Injectable()
export class InformationRepository extends BaseRepository<Information> {
  constructor(
    @InjectRepository(Information)
    informationRepository: Repository<Information>,
  ) {
    super(informationRepository);
  }
}
