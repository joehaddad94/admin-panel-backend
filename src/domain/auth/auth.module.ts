// import { Module } from '@nestjs/common';
// import { AuthMediator } from './AuthMediator';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { JwtService } from '@nestjs/jwt';
// import { MailModule } from '../mail';
// import { AuthController } from './auth.controller';
// import { AuthRepository } from './auth.repository';
// import { AuthService } from './auth.service';
// import { Admin } from '../../core/data/database';

// @Module({
//   imports: [MailModule, TypeOrmModule.forFeature([Admin])],
//   controllers: [AuthController],
//   providers: [AuthMediator, AuthService, AuthRepository, JwtService],
//   exports: [],
// })
// export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMediator } from './AuthMediator';
import { Admin } from '../../core/data/database';
import { AuthRepository } from './auth.repository';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [AuthController],
  providers: [
    AuthMediator,
    AuthService,
    AuthRepository,
    JwtStrategy,
    MailService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
