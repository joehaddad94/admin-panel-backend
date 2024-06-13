import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { catcher } from '../../core/helpers/operation';
import { throwBadRequest } from '../../core/settings/base/errors/errors';
import { ManualCreateDto } from './dto/manual.create.dto';
import { InviteDto } from './dto/invite.dto';
import { MailService } from '../mail/mail.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyTokenDto } from './dto/change-password.dto copy';

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

      if (!passwordIsValid) {
        const accountLocked = await this.service.decrementLoginAttempts(admin);
        throwBadRequest({
          message: accountLocked
            ? 'Account locked due to multiple failed login attempts'
            : 'Invalid Credentials',
          errorCheck: true,
        });
      }

      await this.service.resetLoginAttempts(admin);

      const token = await this.service.generateToken(admin);

      return {
        name: admin.name,
        email: admin.email,
        token,
      };
    });
  };

  manualCreate = async (data: ManualCreateDto) => {
    const { name, email } = data;

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

    const password = this.service.generateRandomPassword();
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
      const { email } = data;
      const templateName = 'invitation.hbs';

      const existingAdmin = await this.service.findOne({
        email,
      });

      if (!existingAdmin) {
        throwBadRequest({
          message: 'Email does not exist',
          errorCheck: true,
        });
      }

      const { link, reset_token } = await this.service.generateLink(email);

      existingAdmin.reset_token = reset_token;
      existingAdmin.reset_token_expiry = new Date(Date.now() + 3600000); // 1 hour expiry
      await existingAdmin.save();

      await this.mailService.sendMail(existingAdmin, templateName);
      return { link };
    });
  };

  changePassword = async (data: ChangePasswordDto) => {
    const { reset_token, newPassword } = data;
    return catcher(async () => {
      const admin = await this.service.findOneByResetToken(reset_token);

      if (!admin) {
        throwBadRequest({
          message: 'Invalid or Expired Token',
          errorCheck: true,
        });
      }

      const currentDate = new Date();
      if (admin.reset_token_expiry < currentDate) {
        throwBadRequest({
          message: 'Token Expired',
          errorCheck: true,
        });
      }

      await this.service.updatePassword(admin, newPassword);
      return { message: 'Password changed successfully.' };
    });
  };

  forgotPassword = async (data: ChangePasswordDto) => {
    const { email } = data;
    return catcher(async () => {
      const admin = await this.service.findOne({ email });

      if (!admin) {
        throwBadRequest({
          message: 'Email not found',
          errorCheck: true,
        });
      }

      const { key } = await this.service.generateResetToken(email);

      admin.reset_token = key;
      admin.reset_token_expiry = new Date(Date.now() + 3600000); // 1 hour expiry
      await admin.save();

      const templateName = 'reset-password.hbs';
      await this.mailService.sendMail(admin, templateName);

      return { message: 'Reset password email sent' };
    });
  };

  verifyToken = async (data: VerifyTokenDto) => {
    const { token } = data;

    throwBadRequest({
      message: 'Invalid token',
      errorCheck: !token,
    });

    const payload = await this.service.verifyToken(token);

    return payload;
  };
}
