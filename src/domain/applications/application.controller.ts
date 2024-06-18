import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApplicationMediator } from './application.mediator';
import { ApiTags } from '@nestjs/swagger';
import { FiltersDto } from '../reports/dtos/filters.dto';

@ApiTags('applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly mediator: ApplicationMediator) {}

  @Get()
  getApplications() {
    return this.mediator.findApplications();
  }

  @Post('find-by-program')
  getApplicationsByProgamId(@Body() filtersDto: FiltersDto) {
    return this.mediator.findApplicationsByProgramId(filtersDto);
  }
}
