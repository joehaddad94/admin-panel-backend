import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DecisionDates } from '../../core/data/database/entities/decision-date.entity';
import { AuthModule } from '../auth';
import AuthMiddleware from '../../core/settings/middlewares/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([DecisionDates]), AuthModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class DecisionDateModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(DecisionDates);
  }
}
