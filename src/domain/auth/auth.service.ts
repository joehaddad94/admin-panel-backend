/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { Admin } from '../../core/data/database';
import { BaseService } from '../../core/settings/base/service/base.service';
import { throwBadRequest } from 'src/core/settings/base/errors/errors';

@Injectable()
export class AuthService extends BaseService<AuthRepository, Admin> {
  private failedLoginCache = new Map<
    string,
    { attempts: number; lastAttempt: number }
  >();
  private tokenCache = new Map<string, { admin: any; timestamp: number }>();

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {
    super(authRepository);
  }

  hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(8); // Reduced from 10 to 8
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
    try {
      // Check cache first (5 minute cache)
      const cacheKey = `token_${token}`;
      const cached = this.tokenCache.get(cacheKey);
      const now = Date.now();

      if (cached && now - cached.timestamp < 5 * 60 * 1000) {
        return cached.admin;
      }

      // Use verify instead of decode for proper signature verification and expiration check
      const payload = this.jwtService.verify(token);

      // Load only necessary fields for performance
      const admin = await this.authRepository.findOne({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          name: true,
          is_active: true,
          login_attempts: true,
        },
      });

      throwBadRequest({
        message: 'User not found for token',
        errorCheck: !admin,
      });

      // Cache the result for 5 minutes
      this.tokenCache.set(cacheKey, { admin, timestamp: now });

      return admin;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throwBadRequest({
          message: 'Token has expired',
          errorCheck: true,
        });
      }
      if (error.name === 'JsonWebTokenError') {
        throwBadRequest({
          message: 'Invalid token',
          errorCheck: true,
        });
      }
      throw error;
    }
  }

  async decrementLoginAttempts(admin: Admin): Promise<boolean> {
    if (admin.login_attempts > 1) {
      admin.login_attempts -= 1;
    } else {
      admin.is_active = false;
      await admin.save();
      return true;
    }
    await admin.save();
    return false;
  }

  async resetLoginAttempts(admin: Admin) {
    admin.login_attempts = 5;
    await admin.save();
    // Clear from cache on successful login
    this.failedLoginCache.delete(admin.email);
  }

  // Cache failed login attempts to reduce database writes
  recordFailedLoginAttempt(email: string): number {
    const now = Date.now();
    const cacheEntry = this.failedLoginCache.get(email);

    if (cacheEntry) {
      cacheEntry.attempts += 1;
      cacheEntry.lastAttempt = now;
    } else {
      this.failedLoginCache.set(email, { attempts: 1, lastAttempt: now });
    }

    return this.failedLoginCache.get(email)!.attempts;
  }

  // Clean up old cache entries (call this periodically)
  cleanupFailedLoginCache() {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const [email, entry] of this.failedLoginCache.entries()) {
      if (entry.lastAttempt < oneHourAgo) {
        this.failedLoginCache.delete(email);
      }
    }
  }

  // Clear token cache for a specific admin (call when admin data changes)
  clearTokenCache(adminId: number) {
    for (const [key, value] of this.tokenCache.entries()) {
      if (value.admin.id === adminId) {
        this.tokenCache.delete(key);
      }
    }
  }

  // Clean up old token cache entries (call this periodically)
  cleanupTokenCache() {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    for (const [key, value] of this.tokenCache.entries()) {
      if (value.timestamp < fiveMinutesAgo) {
        this.tokenCache.delete(key);
      }
    }
  }
}
