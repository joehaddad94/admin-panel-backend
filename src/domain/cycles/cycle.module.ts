import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cycles } from 'src/core/data/database/entities/cycle.entity';
import { CycleController } from './cycle.controller';
import { CycleMediator } from './cycle.mediator';
import { CycleRepository } from './cycle.repository';
import { CycleService } from './cycle.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import AuthMiddleware from '../../core/settings/middlewares/auth.middleware';
import { AuthModule } from '../auth';

@Module({
  imports: [TypeOrmModule.forFeature([Cycles]), AuthModule],
  controllers: [CycleController],
  providers: [CycleMediator, CycleRepository, CycleService, JwtStrategy],
  exports: [CycleRepository, CycleService],
})
export class CycleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(CycleController);
  }
}
