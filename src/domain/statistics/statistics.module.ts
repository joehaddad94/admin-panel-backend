import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsMediator } from './statistics.mediator';
import { StatisticsService } from './statistics.service';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsMediator, StatisticsService],
})
export class StatisticsModule {}
