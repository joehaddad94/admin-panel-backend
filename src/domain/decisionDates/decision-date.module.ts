import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DecisionDates } from '../../core/data/database/entities/decision-date.entity';
import { AuthModule } from '../auth';
import AuthMiddleware from '../../core/settings/middlewares/auth.middleware';
import { DecisionDateController } from './decision-date.controller';
import { DecisionDateMediator } from './decision-date.mediator';
import { DecisionDateRepository } from './decision-date.repository';
import { DecisionDateService } from './decision-date.service';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([DecisionDates]), AuthModule],
  controllers: [DecisionDateController],
  providers: [
    DecisionDateMediator,
    DecisionDateRepository,
    DecisionDateService,
    JwtStrategy,
  ],
  exports: [DecisionDateService, DecisionDateRepository],
})
export class DecisionDateModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(DecisionDates);
  }
}
