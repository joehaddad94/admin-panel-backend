import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { MetabaseMediator } from './metabase.mediator';

@ApiTags('metabase')
@Controller('metabase')
export class MetabaseController {
  constructor(private readonly mediator: MetabaseMediator) {}

  @Get('embed')
  @ApiQuery({ name: 'questionId', required: true, type: Number })
  getEmbedUrl(@Query('questionId') questionId: number) {
    return this.mediator.generateEmbedUrl(questionId);
  }
} 