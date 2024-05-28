import { Information } from 'src/core/data/database/entities/information.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformationMediator } from './informattion.mediator';
import { InformationRepository } from './information.repository';
import { InformationService } from './information.service';
import { InformationController } from './information.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Information])],
  controllers: [InformationController],
  providers: [InformationMediator, InformationRepository, InformationService],
  exports: [InformationService, InformationRepository],
})
export class InformationModule {}
