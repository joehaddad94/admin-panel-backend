import { Injectable } from '@nestjs/common';
import { TemplateCategoryRepository } from './template-category.repository';
import { BaseService } from '../../core/settings/base/service/base.service';
import { TemplateCategory } from '../../core/data/database/entities/template-category.entity';

@Injectable()
export class TemplateCategoryService extends BaseService<TemplateCategoryRepository, TemplateCategory> {
  constructor(private readonly templateCategoryRepository: TemplateCategoryRepository) {
    super(templateCategoryRepository);
  }
}

