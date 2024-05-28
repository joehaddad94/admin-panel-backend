import { Module } from '@nestjs/common';
import { AuthController } from 'src/domain/auth/auth.controller';
import { AuthMediator } from 'src/domain/auth/auth.mediator';
import { AuthService } from 'src/domain/auth/auth.service';
import { AuthRepository } from 'src/domain/auth/auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/core/data/database';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from 'src/domain/mail/mail.module';

@Module({
  imports: [MailModule, TypeOrmModule.forFeature([Admin])],
  controllers: [AuthController],
  providers: [AuthMediator, AuthService, AuthRepository, JwtService],
  exports: [],
})
export class AuthModule {}
