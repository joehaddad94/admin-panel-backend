import { Application } from '@core/data/database/entities/application.entity';
import { ApplicationController } from '../applications/application.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationMediator } from './application.mediator';
import { ApplicationService } from './application.service';
import { ApplicationRepository } from './application.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Application, ApplicationRepository])],
  controllers: [ApplicationController],
  providers: [ApplicationMediator, ApplicationService, ApplicationRepository],
  exports: [ApplicationService, TypeOrmModule],
})
export class ApplicationModule {}
