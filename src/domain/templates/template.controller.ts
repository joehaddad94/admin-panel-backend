import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { TemplateMediator } from './template.mediator';

@ApiTags('templates')
@Controller('templates')
export class TemplateController {
  constructor(private readonly mediator: TemplateMediator) {}
}
