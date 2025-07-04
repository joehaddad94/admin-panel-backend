import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { throwUnauthorized } from '../base/errors/errors';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/domain/auth/auth.service';

@Injectable()
class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    throwUnauthorized({
      errorCheck: !authHeader,
    });

    const splitted = authHeader.split(' ');

    throwUnauthorized({
      errorCheck:
        splitted.length !== 2 || splitted[0] !== process.env.AUTH_HEADER_PREFIX,
    });

    const token = splitted[1];

    try {
      const payload = this.jwtService.verify(token);

      // Properly await the database query
      const admin = await this.adminService.findOne(
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

      // Check if admin exists
      if (!admin) {
        throwUnauthorized({
          errorCheck: true,
        });
      }

      // Check if account is locked
      if (!admin.is_active) {
        throwUnauthorized({
          errorCheck: true,
        });
      }

      // Check if login attempts are exhausted
      if (admin.login_attempts <= 0) {
        throwUnauthorized({
          errorCheck: true,
        });
      }

      req['admin'] = admin;

      next();
    } catch (error) {
      console.log(error);

      throwUnauthorized({
        errorCheck: true,
      });
    }
  }
}

export default AuthMiddleware;
