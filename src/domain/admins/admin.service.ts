import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/settings/base/service/base.service';
import { AdminRepository } from './admin.repository';
import { Admin } from 'src/core/data/database';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService extends BaseService<AdminRepository, Admin> {
  constructor(private readonly adminRepository: AdminRepository) {
    super(adminRepository);
  }

  generateRandomPassword = (length = 12): string => {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    return Array.from(crypto.randomFillSync(new Uint8Array(length)))
      .map((n) => charset[n % charset.length])
      .join('');
  };

  hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
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
}
