import { Injectable, NotFoundException } from '@nestjs/common';
import { catcher } from 'src/core/helpers/operation';
import { StatisticsService } from './statistics.service';
import { StatisticsQueryDto } from './dtos/statistics.dto';
import { ProgramService } from '../programs/program.service';

@Injectable()
export class StatisticsMediator {
  private statisticsCache = new Map<string, { data: any; timestamp: number }>();

  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly programService: ProgramService,
  ) {}

  async getStatistics(query: StatisticsQueryDto) {
    return catcher(async () => {
      const startTime = Date.now();

      // Check cache first
      const cacheKey = `statistics_${query.programId}_${query.cycleId}`;
      const cached = this.statisticsCache.get(cacheKey);
      const now = Date.now();

      if (cached && now - cached.timestamp < 1 * 60 * 1000) {
        return cached.data;
      }

      const program = await this.programService.findOne({
        id: query.programId,
      });

      if (!program) {
        throw new NotFoundException('Program not found');
      }

      const programAbbreviation = program.abbreviation;

      if (programAbbreviation === 'FCS') {
        const [
          applicationStatusCounts,
          eligibilityStatistics,
          screeningStatistics,
          paymentStatistics,
          sectionDistribution,
          emailStatistics,
          selectionTimeline,
        ] = await Promise.all([
          this.statisticsService.getApplicationStatusCounts(query),
          this.statisticsService.getFCSEligibilityStatistics(query),
          this.statisticsService.getFCSScreeningStatistics(query),
          this.statisticsService.getFCSPaymentStatistics(query),
          this.statisticsService.getFCSSectionDistribution(query),
          this.statisticsService.getFCSEmailStatistics(query),
          this.statisticsService.getFCSSelectionTimeline(query),
        ]);

        const result = {
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

        const executionTime = Date.now() - startTime;
        console.log(
          `FCS Statistics performance: ${executionTime}ms for programId=${query.programId}, cycleId=${query.cycleId}`,
        );

        // Cache the result
        this.statisticsCache.set(cacheKey, { data: result, timestamp: now });

        return result;
      } else {
        const [
          applicationStatusCounts,
          failedInterviewPercentage,
          passedExamPercentage,
          passedInterviewPercentage,
          applicationSelectionStatistics,
          selectionTimeline,
        ] = await Promise.all([
          this.statisticsService.getApplicationStatusCounts(query),
          this.statisticsService.getFailedInterviewPercentage(query),
          this.statisticsService.getExamPassStatistics(query),
          this.statisticsService.getInterviewProgressStatistics(query),
          this.statisticsService.getApplicationSelectionStatistics(query),
          this.statisticsService.getSelectionTimeline(query),
        ]);

        const result = {
          data: {
            applicationStatusCounts,
            failedInterviewPercentage,
            passedExamPercentage,
            passedInterviewPercentage,
            applicationSelectionStatistics,
            selectionTimeline,
          },
        };

        const executionTime = Date.now() - startTime;
        console.log(
          `FSE Statistics performance: ${executionTime}ms for programId=${query.programId}, cycleId=${query.cycleId}`,
        );

        // Cache the result
        this.statisticsCache.set(cacheKey, { data: result, timestamp: now });

        return result;
      }
    });
  }
}
