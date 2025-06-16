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
      const failedInterviewPercentage =
        await this.statisticsService.getFailedInterviewPercentage(query);
      const passedExamPercentage =
        await this.statisticsService.getExamPassStatistics(query);
      const passedInterviewPercentage =
        await this.statisticsService.getInterviewProgressStatistics(query);
      const applicationSelectionStatistics =
        await this.statisticsService.getApplicationSelectionStatistics(query);
      const selectionTimeline =
        await this.statisticsService.getSelectionTimeline(query);

      return {
        data: {
          applicationStatusCounts,
          failedInterviewPercentage,
          passedExamPercentage,
          passedInterviewPercentage,
          applicationSelectionStatistics,
          selectionTimeline,
        },
      };
    });
  }
}
