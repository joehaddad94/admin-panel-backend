import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sections } from 'src/core/data/database/entities/section.entity';
import { AuthModule } from '../auth';
import { CycleModule } from '../cycles/cycle.module';
import AuthMiddleware from 'src/core/settings/middlewares/auth.middleware';
import { SectionRepository } from './section.repository';
import { JwtStrategy } from '../auth/jwt.strategy';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { SectionMediator } from './section.mediator';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sections, SectionRepository]),
    AuthModule,
    CycleModule,
  ],
  controllers: [SectionController],
  providers: [JwtStrategy, SectionRepository, SectionService, SectionMediator],
  exports: [SectionRepository, SectionService],
})
export class SectionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(SectionController);
  }
}
