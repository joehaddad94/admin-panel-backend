import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateCategoryController } from './template-category.controller';
import { TemplateCategoryService } from './template-category.service';
import { TemplateCategoryMediator } from './template-category.mediator';
import { TemplateCategoryRepository } from './template-category.repository';
import { TemplateCategory } from '../../core/data/database/entities/template-category.entity';
import { JwtStrategy } from '../auth/jwt.strategy';
import AuthMiddleware from 'src/core/settings/middlewares/auth.middleware';
import { AuthModule } from '../auth';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateCategory]), AuthModule],
  controllers: [TemplateCategoryController],
  providers: [TemplateCategoryMediator, TemplateCategoryService, TemplateCategoryRepository, JwtStrategy],
  exports: [TemplateCategoryService],
})
export class TemplateCategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(TemplateCategoryController);
  }
}

