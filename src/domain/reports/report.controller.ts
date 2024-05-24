import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReportMediator } from './report.mediator';
import { FiltersDto } from './dtos/filters.dto';

@Controller('reports')
export class ReportController {
  constructor(private readonly mediator: ReportMediator) {}

  @Post('applications')
  applicationReport(@Body() FiltersDto: FiltersDto) {
    return this.mediator.applicationReport(FiltersDto);
  }

  @Post('information')
  informationReport(@Body() FiltersDto: FiltersDto) {
    return this.mediator.informationReport(FiltersDto);
  }
}
