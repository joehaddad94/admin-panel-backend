import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatisticsMediator } from './statistics.mediator';
import { StatisticsQueryDto } from './dtos/statistics.dto';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly mediator: StatisticsMediator) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getStatistics(@Query() query: StatisticsQueryDto) {
    const applicationsStatusChart =
      await this.mediator.getApplicationStatusChart(query);
    return {
      ...applicationsStatusChart,
    };
  }
}
