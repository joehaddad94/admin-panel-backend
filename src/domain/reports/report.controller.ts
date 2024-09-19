import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ReportMediator } from './report.mediator';
import { FiltersDto } from './dtos/filters.dto';
import { ReportType } from './dtos/report-type.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly mediator: ReportMediator) {}

  @Post()
  generateReport(@Body() filtersDto: FiltersDto) {
    const { reportType } = filtersDto;
    console.log(
      '🚀 ~ ReportController ~ generateReport ~ reportType:',
      reportType,
    );

    switch (reportType) {
      case ReportType.APPLICATIONS:
        return this.mediator.applicationReport(filtersDto);

      case ReportType.INFORMATION:
        return this.mediator.informationReport(filtersDto);

      case ReportType.USERS:
        return this.mediator.usersReport(filtersDto);

      default:
        throw new HttpException('Invalid report type', HttpStatus.BAD_REQUEST);
    }
  }
}
