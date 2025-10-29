import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/settings/base/repository/base.repository';
import { TemplateCategory } from '../../core/data/database/entities/template-category.entity';

@Injectable()
export class TemplateCategoryRepository extends BaseRepository<TemplateCategory> {
  constructor(@InjectRepository(TemplateCategory) templateCategoryRepository: Repository<TemplateCategory>) {
    super(templateCategoryRepository);
  }
}

