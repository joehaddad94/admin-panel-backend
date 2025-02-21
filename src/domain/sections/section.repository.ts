import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sections } from 'src/core/data/database/entities/section.entity';
import { BaseRepository } from 'src/core/settings/base/repository/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class SectionRepository extends BaseRepository<Sections> {
  constructor(
    @InjectRepository(Sections)
    sectionRepository: Repository<Sections>,
  ) {
    super(sectionRepository);
  }
}
