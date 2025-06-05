import { Injectable } from '@nestjs/common';
import { catcher } from 'src/core/helpers/operation';
import { StatisticsService } from './statistics.service';
import { StatisticsQueryDto } from './dtos/statistics.dto';

@Injectable()
export class StatisticsMediator {
  constructor(private readonly statisticsService: StatisticsService) {}

  async getStatistics(query: StatisticsQueryDto) {
    return catcher(async () => {
      const applicationStatusCounts =
        await this.statisticsService.getApplicationStatusCounts(query);

      return {
        data: {
          applicationStatusCounts,
        },
      };
    });
  }
}
