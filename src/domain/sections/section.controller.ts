import { ApiTags } from '@nestjs/swagger';
import { SectionMediator } from './section.mediator';
import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@ApiTags('sections')
@Controller('sections')
export class SectionController {
  constructor(private readonly mediator: SectionMediator) {}

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  getSections(@Query('cycleId') cycleId?: number) {
    return this.mediator.findSections(cycleId);
  }
}
