import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cycles } from 'src/core/data/database/entities/cycle.entity';
import { CycleController } from './cycle.controller';
import { CycleMediator } from './cycle.mediator';
import { CycleRepository } from './cycle.repository';
import { CycleService } from './cycle.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cycles])],
  controllers: [CycleController],
  providers: [CycleMediator, CycleRepository, CycleService],
  exports: [CycleRepository, CycleService],
})
export class CycleModule {}
