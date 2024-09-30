import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Threshold } from 'src/core/data/database/entities/threshold.entity';
import { AuthModule } from '../auth';
import AuthMiddleware from 'src/core/settings/middlewares/auth.middleware';
import { AuthController } from '../auth/auth.controller';
import { JwtStrategy } from '../auth/jwt.strategy';
import { ThresholdRepository } from './threshold.repository';
import { ThresholdController } from './threshold.controller';
import { ThresholdMediator } from './threshold.mediator';
import { ThresholdService } from './threshold.service';

@Module({
  imports: [TypeOrmModule.forFeature([Threshold]), AuthModule],
  controllers: [ThresholdController],
  providers: [
    JwtStrategy,
    ThresholdRepository,
    ThresholdMediator,
    ThresholdService,
  ],
  exports: [ThresholdRepository, ThresholdService],
})
export class ThresholdModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ThresholdController);
  }
}
