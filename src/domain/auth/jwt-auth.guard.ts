import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const splitted = authHeader.split(' ');

    if (splitted.length !== 2 || splitted[0] !== process.env.AUTH_HEADER_PREFIX) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    const token = splitted[1];

    try {
      const payload = this.jwtService.verify(token);

      // Get admin with account status
      const admin = await this.authService.findOne(
        { id: payload.sub },
        undefined,
        {
          id: true,
          email: true,
          name: true,
          is_active: true,
          login_attempts: true
        }
      );

      if (!admin) {
        throw new UnauthorizedException('Admin not found');
      }

      // Check if account is locked
      if (!admin.is_active) {
        throw new UnauthorizedException('Account is locked');
      }

      // Check if login attempts are exhausted
      if (admin.login_attempts <= 0) {
        throw new UnauthorizedException('Account locked due to multiple failed login attempts');
      }

      // Attach admin to request
      request.admin = admin;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
} 