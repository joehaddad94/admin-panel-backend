import { Injectable } from '@nestjs/common';
import { TemplateRepository } from './template.repository';
import { Templates } from 'src/core/data/database/entities/template.entity';
import { BaseService } from 'src/core/settings/base/service/base.service';

@Injectable()
export class TemplateService extends BaseService<
  TemplateRepository,
  Templates
> {
  constructor(private readonly templateRepository: TemplateRepository) {
    super(templateRepository);
  }
}
