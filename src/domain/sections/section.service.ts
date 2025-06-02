import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/settings/base/service/base.service';
import { SectionRepository } from './section.repository';
import { Sections } from 'src/core/data/database/entities/section.entity';

@Injectable()
export class SectionService extends BaseService<SectionRepository, Sections> {
  constructor(private readonly sectionRepository: SectionRepository) {
    super(sectionRepository);
  }
}
