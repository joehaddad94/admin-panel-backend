import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportMediator } from './report.mediator';
import { ApplicationModule } from '../applications/application.module';
import { InformationModule } from '../information/information.module';
import { UserModule } from '../users/user.module';
import AuthMiddleware from 'src/core/settings/middlewares/auth.middleware';
import { AuthModule } from '../auth';

@Module({
  imports: [InformationModule, ApplicationModule, UserModule, AuthModule],
  controllers: [ReportController],
  providers: [ReportMediator],
  exports: [],
})
export class ReportModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ReportController);
  }
}
