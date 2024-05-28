import { ApplicationModule } from 'src/domain/applications/application.module';
import { InformationModule } from 'src/domain/information/information.module';
import { UserModule } from 'src/domain/users/user.module';
import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportMediator } from './report.mediator';

@Module({
  imports: [InformationModule, ApplicationModule, UserModule],
  controllers: [ReportController],
  providers: [ReportMediator],
  exports: [],
})
export class ReportModule {}
