import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { catcher } from '../../core/helpers/operation';
import { throwBadRequest } from '../../core/settings/base/errors/errors';
import { MailService } from '../mail/mail.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyTokenDto } from './dto/verifyToken.dto';

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

      // Quick email validation first
      const emailValid = this.service.verifyEmail(email);
      throwBadRequest({
        message: 'Invalid email format',
        errorCheck: !emailValid,
      });

      // Get admin with only necessary fields
      const admin = await this.service.findOne({ email }, undefined, {
        id: true,
        email: true,
        password: true,
        name: true,
        login_attempts: true,
        is_active: true,
      });

      throwBadRequest({
        message: 'Admin not found',
        errorCheck: !admin,
      });

      // Check if account is locked first
      if (!admin.is_active) {
        throwBadRequest({
          message: 'Account is locked',
          errorCheck: true,
        });
      }

      // Check login attempts before expensive bcrypt operation
      if (admin.login_attempts <= 0) {
        throwBadRequest({
          message: 'Account locked due to multiple failed login attempts',
          errorCheck: true,
        });
      }

      const passwordIsValid = await this.service.comparePassword(
        password,
        admin.password,
      );

      if (!passwordIsValid) {
        // Use cache for failed attempts to reduce database writes
        const failedAttempts = this.service.recordFailedLoginAttempt(email);

        if (failedAttempts >= 5) {
          // Only update database when we need to lock the account
          const accountLocked = await this.service.decrementLoginAttempts(
            admin,
          );
          throwBadRequest({
            message: accountLocked
              ? 'Account locked due to multiple failed login attempts'
              : 'Invalid Credentials',
            errorCheck: true,
          });
        } else {
          throwBadRequest({
            message: 'Invalid Credentials',
            errorCheck: true,
          });
        }
      }

      // Reset login attempts only on successful login
      await this.service.resetLoginAttempts(admin);

      const token = await this.service.generateToken(admin);

      return {
        name: admin.name,
        email: admin.email,
        token,
      };
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
      await this.mailService.sendInvitationEmail(admin, templateName);

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
