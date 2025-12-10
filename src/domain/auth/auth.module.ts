import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMediator } from './AuthMediator';
import { Admin } from '../../core/data/database';
import { AuthRepository } from './auth.repository';
import { MailService } from '../mail/mail.service';
import { UserModule } from '../users/user.module';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), UserModule],
  controllers: [AuthController],
  providers: [
    AuthMediator,
    AuthService,
    AuthRepository,
    JwtStrategy,
    MailService,
    JwtAuthGuard,
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
