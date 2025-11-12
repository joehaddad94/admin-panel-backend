import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/core/settings/base/repository/base.repository';
import { Templates } from 'src/core/data/database/entities/template.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TemplateRepository extends BaseRepository<Templates> {
  constructor(
    @InjectRepository(Templates)
    templateRepository: Repository<Templates>,
  ) {
    super(templateRepository);
  }
}
