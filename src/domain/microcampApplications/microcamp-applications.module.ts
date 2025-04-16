import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthMiddleware from 'src/core/settings/middlewares/auth.middleware';
import { AuthModule } from '../auth';
import { MicrocampApplicationController } from './microcamp-applications.controller';
import { MicrocampApplication } from 'src/core/data/database/entities/microcamp-application.entity';
import { MicrocampApplicationRepository } from './microcamp-applications.repository';
import { MicrocampApplicationMediator } from './microcamp-applications.mediator';
import { MicrocampApplicationService } from './microcamp-applications.service';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MicrocampApplication,
      MicrocampApplicationRepository,
    ]),
    AuthModule,
  ],
  controllers: [MicrocampApplicationController],
  providers: [
    MicrocampApplicationMediator,
    MicrocampApplicationRepository,
    MicrocampApplicationService,
    JwtStrategy,
  ],
  exports: [MicrocampApplicationRepository, MicrocampApplicationService],
})
export class MicrocampApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(MicrocampApplicationController);
  }
}
