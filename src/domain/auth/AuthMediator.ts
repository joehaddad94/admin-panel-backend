// import { Injectable } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { ManualCreateDto } from './dto/manual.create.dto';
// import { LoginDto } from './dto/login.dto';
// import { MailService } from '../mail';
// import { InviteDto } from './dto/invite.dto';
// import { VerifyDto } from './dto/verify.dto';
// import { catcher } from '../../core/helpers/operation';
// import {
//   throwBadRequest,
//   throwForbidden,
// } from '../../core/settings/base/errors/errors';

// @Injectable()
// export class AuthMediator {
//   constructor(
//     private readonly service: AuthService,
//     private readonly mailService: MailService,
//   ) {}

//   invite = async (data: InviteDto) => {
//     return catcher(async () => {
//       const { email, role, name } = data;

//       const verifyEmail = this.service.verifyEmail(email);

//       throwBadRequest({
//         message: 'Email is not valid',
//         errorCheck: !verifyEmail,
//       });

//       const found = await this.service.findOne({
//         email,
//       });

//       throwBadRequest({
//         message: 'Email already in use',
//         errorCheck: !!found,
//       });

//       const { link, key } = await this.service.generateLink(email);

//       const user = this.service.create({
//         name,
//         email,
//         role,
//         isActive: false,
//         verificationKey: key,
//       });

//       await user.save();

//       await this.mailService.sendRegistractionMail(user);

//       return { link };
//     });
//   };

//   verify = async (data: VerifyDto) => {
//     return catcher(async () => {
//       const { key, password } = data;

//       const user = await this.service.findOne({
//         verificationKey: key,
//       });

//       throwForbidden({
//         action: 'Verification',
//         errorCheck: !user,
//       });

//       user.isActive = true;
//       user.verificationKey = null;

//       const hashedPassword = await this.service.hashPassword(password);

//       user.password = hashedPassword;

//       await user.save();

//       const token = await this.service.generateToken(user);

//       return { token, user };
//     });
//   };

//   login = async (data: LoginDto) => {
//     return catcher(async () => {
//       const { email, password } = data;

//       const user = await this.service.findOne(
//         {
//           email,
//         },
//         [],
//         {
//           id: true,
//           name: true,
//           email: true,
//           password: true,
//           role: true,
//           isActive: true,
//         },
//       );

//       throwBadRequest({
//         message: 'User not found',
//         errorCheck: !user,
//       });

//       const isPasswordCorrect = await this.service.comparePassword(
//         password,
//         user.password,
//       );

//       throwBadRequest({
//         message: 'Password is incorrect',
//         errorCheck: !isPasswordCorrect,
//       });

//       const token = await this.service.generateToken(user);

//       return { token, user };
//     });
//   };

//   manualCreate = async (data: ManualCreateDto) => {
//     return catcher(async () => {
//       const { email, role, name, password } = data;

//       const hashedPassword = await this.service.hashPassword(password);

//       const user = this.service.create({
//         name,
//         email,
//         role,
//         password: hashedPassword,
//         isActive: true,
//       });

//       await user.save();

//       return user;
//     });
//   };
// }

import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { catcher } from '../../core/helpers/operation';
import { throwBadRequest } from '../../core/settings/base/errors/errors';
import { ManualCreateDto } from './dto/manual.create.dto';
import { InviteDto } from './dto/invite.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthMediator {
  constructor(
    private readonly service: AuthService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  login = async (data: LoginDto) => {
    return catcher(async () => {
      const { email, password } = data;

      const emailValid = this.service.verifyEmail(email);
      throwBadRequest({
        message: 'Invalid email format',
        errorCheck: !emailValid,
      });

      const admin = await this.service.findOne({ email });

      throwBadRequest({
        message: 'Admin not found',
        errorCheck: !admin,
      });

      const passwordIsValid = await this.service.comparePassword(
        password,
        admin.password,
      );

      throwBadRequest({
        message: 'Invalid Credentials',
        errorCheck: !passwordIsValid,
      });

      const token = await this.service.generateToken(admin);

      return {
        name: admin.name,
        email: admin.email,
        token,
      };
    });
  };

  manualCreate = async (data: ManualCreateDto) => {
    const { name, email, password } = data;

    const emailValid = this.service.verifyEmail(email);
    throwBadRequest({
      message: 'Invalid email format',
      errorCheck: !emailValid,
    });

    const existingAdmin = await this.service.findOne({ email });

    if (existingAdmin) {
      throwBadRequest({
        message: 'Admin already exists with the provided email.',
        errorCheck: true,
      });
    }

    const hashedPassword = await this.service.hashPassword(password);

    const admin = this.service.create({
      name,
      email,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
      isActive: true,
      login_attempts: 5,
    });

    await admin.save();

    const { password: omitted, ...adminData } = admin;
    return adminData;
  };

  invite = async (data: InviteDto) => {
    return catcher(async () => {
      const { email, name } = data;

      const found = await this.service.findOne({
        email,
      });

      throwBadRequest({
        message: 'Email already in use',
        errorCheck: !!found,
      });

      const { link, key } = await this.service.generateLink(email);

      const user = this.service.create({
        name,
        email,
        isActive: false,
        reset_token: key,
      });

      await user.save();

      await this.mailService.sendRegistrationMail(user);

      return { link };
    });
  };
}
