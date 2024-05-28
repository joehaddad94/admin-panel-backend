import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportMediator } from './report.mediator';
import { ApplicationModule } from '../applications/application.module';
import { InformationModule } from '../information/information.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [InformationModule, ApplicationModule, UserModule],
  controllers: [ReportController],
  providers: [ReportMediator],
  exports: [],
})
export class ReportModule {}
