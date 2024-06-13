import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { Admin } from '../../core/data/database';
import { BaseService } from '../../core/settings/base/service/base.service';
import { throwBadRequest } from '../../core/settings/base/errors/errors';

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

  generateResetToken = async (email: string) => {
    const resetToken = crypto
      .randomBytes(32)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const link = `${process.env.VERIFY_CLIENT_URL}?key=${resetToken}&email=${email}`;

    return { link, key: resetToken };
  };

  generateToken = async (user: Admin) => {
    const payload = { sub: user.id };

    const token = this.jwtService.sign(payload);

    return token;
  };

  generateLink = async (email: string) => {
    const reset_token = crypto
      .randomBytes(32)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const link = `${process.env.VERIFY_CLIENT_URL}?key=${reset_token}&email=${email}`;

    return { link, reset_token };
  };

  generateRandomPassword = (length = 12): string => {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    return Array.from(crypto.randomFillSync(new Uint8Array(length)))
      .map((n) => charset[n % charset.length])
      .join('');
  };

  async findOneByResetToken(reset_token: string): Promise<Admin | null> {
    return this.authRepository.findOne({ where: { reset_token } });
  }

  async updatePassword(admin: Admin, newPassword: string): Promise<void> {
    admin.password = await this.hashPassword(newPassword);
    admin.reset_token = null;
    admin.reset_token_expiry = null;
    await this.authRepository.save(admin);
  }

  async verifyToken(token: string) {
    const payload = await this.jwtService.decode(token);

    const updated = await this.authRepository.findOne({
      where: { id: payload.sub },
    });

    return updated;
  }

  async decrementLoginAttempts(admin: Admin): Promise<boolean> {
    if (admin.login_attempts > 1) {
      admin.login_attempts -= 1;
    } else {
      admin.isActive = false;
      await admin.save();
      return true;
    }
    await admin.save();
    return false;
  }

  async resetLoginAttempts(admin: Admin) {
    admin.login_attempts = 5;
    await admin.save();
  }
}
