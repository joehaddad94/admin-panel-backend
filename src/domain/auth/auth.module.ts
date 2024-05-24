import { Module } from '@nestjs/common';
import { AuthController } from '@domain/auth/auth.controller';
import { AuthMediator } from '@domain/auth/auth.mediator';
import { AuthService } from '@domain/auth/auth.service';
import { AuthRepository } from '@domain/auth/auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '@core/data/database';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from '@domain/mail/mail.module';

@Module({
  imports: [MailModule, TypeOrmModule.forFeature([Admin])],
  controllers: [AuthController],
  providers: [AuthMediator, AuthService, AuthRepository, JwtService],
  exports: [],
})
export class AuthModule {}
