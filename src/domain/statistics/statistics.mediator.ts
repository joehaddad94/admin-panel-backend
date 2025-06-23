import { Injectable, NotFoundException } from '@nestjs/common';
import { catcher } from 'src/core/helpers/operation';
import { StatisticsService } from './statistics.service';
import { StatisticsQueryDto } from './dtos/statistics.dto';
import { ProgramService } from '../programs/program.service';

@Injectable()
export class StatisticsMediator {
  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly programService: ProgramService,
  ) {}

  async getStatistics(query: StatisticsQueryDto) {
    return catcher(async () => {
      const program = await this.programService.findOne({
        id: query.programId,
      });

      if (!program) {
        throw new NotFoundException('Program not found');
      }

      const programAbbreviation = program.abbreviation;

      if (programAbbreviation === 'FCS') {
        const applicationStatusCounts =
          await this.statisticsService.getApplicationStatusCounts(query);
        const eligibilityStatistics =
          await this.statisticsService.getFCSEligibilityStatistics(query);
        const screeningStatistics =
          await this.statisticsService.getFCSScreeningStatistics(query);
        const paymentStatistics =
          await this.statisticsService.getFCSPaymentStatistics(query);
        const sectionDistribution =
          await this.statisticsService.getFCSSectionDistribution(query);
        const emailStatistics =
          await this.statisticsService.getFCSEmailStatistics(query);
        const selectionTimeline =
          await this.statisticsService.getFCSSelectionTimeline(query);

        return {
          data: {
            applicationStatusCounts,
            eligibilityStatistics,
            screeningStatistics,
            paymentStatistics,
            sectionDistribution,
            emailStatistics,
            selectionTimeline,
          },
        };
      } else {
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
      }
    });
  }
}
