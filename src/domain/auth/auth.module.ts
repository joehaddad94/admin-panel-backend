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
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../core/data/constants/jwt.consts';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
