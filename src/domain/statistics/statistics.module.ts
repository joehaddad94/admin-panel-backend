import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsMediator } from './statistics.mediator';
import { StatisticsService } from './statistics.service';
import { ProgramModule } from '../programs/program.module';

@Module({
  imports: [ProgramModule],
  controllers: [StatisticsController],
  providers: [StatisticsMediator, StatisticsService],
  exports: [StatisticsService, StatisticsMediator],
})
export class StatisticsModule {}
