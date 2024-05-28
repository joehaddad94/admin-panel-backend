import { Module } from '@nestjs/common';
import { AuthMediator } from './AuthMediator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from '../mail';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { Admin } from '../../core/data/database';

@Module({
  imports: [MailModule, TypeOrmModule.forFeature([Admin])],
  controllers: [AuthController],
  providers: [AuthMediator, AuthService, AuthRepository, JwtService],
  exports: [],
})
export class AuthModule {}
