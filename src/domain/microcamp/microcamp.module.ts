import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth';
import AuthMiddleware from 'src/core/settings/middlewares/auth.middleware';
import { MicrocampController } from './microcamp.controller';
import { Microcamp } from 'src/core/data/database/entities/microcamp.entity';
import { MicrocampRepository } from './microcamp.repository';
import { MicrocampMediator } from './microcamp.mediator';
import { MicrocampService } from './microcamp.service';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Microcamp, MicrocampRepository]),
    AuthModule,
  ],
  controllers: [MicrocampController],
  providers: [
    MicrocampMediator,
    MicrocampRepository,
    MicrocampService,
    JwtStrategy,
  ],
  exports: [MicrocampRepository, MicrocampService],
})
export class MicrocampModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(MicrocampController);
  }
}
