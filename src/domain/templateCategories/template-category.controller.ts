import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TemplateCategoryMediator } from './template-category.mediator';

@ApiTags('template-categories')
@Controller('template-categories')
export class TemplateCategoryController {
  constructor(private readonly mediator: TemplateCategoryMediator) {}

  @Get()
  getTemplateCategories() {
    return this.mediator.findTemplateCategories();
  }
}

