import { ApiTags } from '@nestjs/swagger';
import { SectionMediator } from './section.mediator';
import {
  Body,
  Controller,
  Delete,
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

  @Delete('delete-sections')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async deleteCycle(@Body() data: string | string[]) {
    return this.mediator.deleteCycles(data);
  }
}
