import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Templates } from 'src/core/data/database/entities/template.entity';
import AuthMiddleware from 'src/core/settings/middlewares/auth.middleware';
import { TemplateRepository } from './template.repository';
import { TemplateController } from './template.controller';
import { TemplateMediator } from './template.mediator';
import { TemplateService } from './template.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AuthModule } from '../auth';
import { MailModule } from '../mail/mail.module';
import { ProgramModule } from '../programs/program.module';

@Module({
  imports: [TypeOrmModule.forFeature([Templates]), AuthModule, MailModule, ProgramModule],
  controllers: [TemplateController],
  providers: [
    TemplateRepository,
    TemplateMediator,
    TemplateService,
    JwtStrategy,
  ],
  exports: [TemplateRepository, TemplateService],
})
export class TemplateModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(TemplateController);
  }
}
