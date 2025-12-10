import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from '../../core/data/database/entities/program.entity';
import { ProgramService } from './program.service';
import { ProgramController } from './program.contoller';
import { ProgramMediator } from './program.mediator';
import { ProgramRepository } from './program.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Program])],
  controllers: [ProgramController],
  providers: [ProgramMediator, ProgramService, ProgramRepository],
  exports: [ProgramService],
})
export class ProgramModule {}
