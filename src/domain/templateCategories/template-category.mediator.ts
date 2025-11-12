import { Injectable } from '@nestjs/common';
import { TemplateCategoryService } from './template-category.service';
import { catcher } from '../../core/helpers/operation';
import { throwNotFound } from '../../core/settings/base/errors/errors';

@Injectable()
export class TemplateCategoryMediator {
  constructor(private readonly service: TemplateCategoryService) {}

  findTemplateCategories = async () => {
    return catcher(async () => {
      const found = await this.service.findMany({});

      throwNotFound({
        entity: 'TemplateCategory',
        errorCheck: !found,
      });

      return found;
    });
  };
}

