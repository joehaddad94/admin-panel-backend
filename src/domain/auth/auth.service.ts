// import { Injectable } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import * as crypto from 'crypto';
// import { JwtService } from '@nestjs/jwt';
// import { AuthRepository } from './auth.repository';
// import { Admin } from '../../core/data/database';
// import { BaseService } from '../../core/settings/base/service/base.service';

// @Injectable()
// export class AuthService extends BaseService<AuthRepository, Admin> {
//   constructor(
//     private readonly authRepository: AuthRepository,
//     private readonly jwtService: JwtService,
//   ) {
//     super(authRepository);
//   }

//   hashPassword = async (password: string) => {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     return hashedPassword;
//   };

//   comparePassword = async (password: string, hashed: string) => {
//     const isPasswordCorrect = await bcrypt.compare(password, hashed);

//     return isPasswordCorrect;
//   };

//   verifyEmail = (email: string) => {
//     const emailRegex = /\S+@\S+\.\S+/;

//     const formatCheck = emailRegex.test(email);

//     return formatCheck;
//   };

//   generateLink = async (email: string) => {
//     const verificationKey = crypto
//       .randomBytes(32)
//       .toString('base64')
//       .replace(/\+/g, '-')
//       .replace(/\//g, '_')
//       .replace(/=/g, '');

//     const link = `${process.env.VERIFY_CLIENT_URL}?key=${verificationKey}&email=${email}`;

//     return { link, key: verificationKey };
//   };

//   generateToken = async (user: Admin) => {
//     const payload = { sub: user.id, role: user.role };

//     const token = this.jwtService.sign(payload, {
//       secret: process.env.JWT_SECRET,
//     });

//     return token;
//   };
// }

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { Admin } from '../../core/data/database';
import { BaseService } from '../../core/settings/base/service/base.service';

@Injectable()
export class AuthService extends BaseService<AuthRepository, Admin> {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {
    super(authRepository);
  }

  hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  };

  comparePassword = async (password: string, hashed: string) => {
    const isPasswordCorrect = await bcrypt.compare(password, hashed);

    return isPasswordCorrect;
  };

  verifyEmail = (email: string) => {
    const emailRegex = /\S+@\S+\.\S+/;

    const formatCheck = emailRegex.test(email);

    return formatCheck;
  };

  //   generateLink = async (email: string) => {
  //     const verificationKey = crypto
  //       .randomBytes(32)
  //       .toString('base64')
  //       .replace(/\+/g, '-')
  //       .replace(/\//g, '_')
  //       .replace(/=/g, '');

  //     const link = `${process.env.VERIFY_CLIENT_URL}?key=${verificationKey}&email=${email}`;

  //     return { link, key: verificationKey };
  //   };

  generateToken = async (user: Admin) => {
    const payload = { sub: user.id };

    // const token = this.jwtService.sign(payload, {
    //   secret: process.env.JWT_SECRET,
    // });

    const token = this.jwtService.sign(payload);

    return token;
  };
}
