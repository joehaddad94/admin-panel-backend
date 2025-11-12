import { ApiTags } from '@nestjs/swagger';
import { SectionMediator } from './section.mediator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEditSectionDto } from './dtos/createEditSection.dtos';

@ApiTags('sections')
@Controller('sections')
export class SectionController {
  constructor(private readonly mediator: SectionMediator) {}

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  getSections(@Query('cycleId') cycleId?: number) {
    return this.mediator.findSections(cycleId);
  }

  @Post('create-edit-section')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createEditSection(@Body() data: CreateEditSectionDto) {
    return this.mediator.createEditSection(data);
  }

  @Delete('delete-sections')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async deleteCycle(@Body() data: string | string[]) {
    return this.mediator.deleteCycles(data);
  }
}
