import { ApplicationController } from '../applications/application.controller';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationMediator } from './application.mediator';
import { ApplicationService } from './application.service';
import { ApplicationRepository } from './application.repository';
import { Application } from '../../core/data/database/entities/application.entity';
import { CycleModule } from '../cycles/cycle.module';
import AuthMiddleware from 'src/core/settings/middlewares/auth.middleware';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AuthModule } from '../auth';
import { MailModule } from '../mail/mail.module';
import { ProgramModule } from '../programs/program.module';
import { InformationModule } from '../information/information.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, ApplicationRepository]),
    CycleModule,
    AuthModule,
    MailModule,
    ProgramModule,
    InformationModule,
  ],
  controllers: [ApplicationController],
  providers: [
    ApplicationMediator,
    ApplicationService,
    ApplicationRepository,
    JwtStrategy,
  ],
  exports: [ApplicationService, TypeOrmModule],
})
export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ApplicationController);
  }
}
