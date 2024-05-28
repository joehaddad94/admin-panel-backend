import { Information } from 'src/core/data/database/entities/information.entity';
import { BaseRepository } from 'src/core/settings/base/repository/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class InformationRepository extends BaseRepository<Information> {
  constructor(
    @InjectRepository(Information)
    informationRepository: Repository<Information>,
  ) {
    super(informationRepository);
  }
}
