import { ApiTags } from '@nestjs/swagger';
import { TemplateMediator } from './template.mediator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEditTemplateDto } from './dtos/createEditTemplate.dto';
import {
  DeleteTemplatesDto,
  GetTemplatesDto,
} from './dtos/templateFilters.dto';
import { TestSendEmailTemplateDto } from './dtos/testSendEmailTemplate.dto';

@ApiTags('templates')
@Controller('templates')
export class TemplateController {
  constructor(private readonly mediator: TemplateMediator) {}

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  getTemplates(@Query() filters: GetTemplatesDto) {
    return this.mediator.findTemplates(filters);
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  getTemplateById(@Param('id') id: number) {
    return this.mediator.getTemplateById(id);
  }

  @Post('create-edit-template')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createEditTemplate(@Body() data: CreateEditTemplateDto) {
    return this.mediator.createEditTemplate(data);
  }

  @Delete('delete-templates')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async deleteTemplates(@Body() data: DeleteTemplatesDto) {
    return this.mediator.deleteTemplates(data);
  }

  @Post('test-send-email-template')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  testSendEmailTemplate(@Body() data: TestSendEmailTemplateDto) {
    return this.mediator.testSendEmailTemplate(data);
  }
}
