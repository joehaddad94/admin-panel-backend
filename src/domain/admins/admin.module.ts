import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/core/data/database';
import { AdminController } from './admin.controller';
import { AdminMediator } from './admin.mediator';
import { AdminRepository } from './admin.repository';
import { MailService } from '../mail/mail.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AdminService } from './admin.service';
import AuthMiddleware from 'src/core/settings/middlewares/auth.middleware';
import { AuthModule } from '../auth';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), AuthModule],
  controllers: [AdminController],
  providers: [
    AdminMediator,
    AdminService,
    AdminRepository,
    MailService,
    JwtStrategy,
  ],
  exports: [AdminService],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AdminController);
  }
}
