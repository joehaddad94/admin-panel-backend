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

  use(req: Request, res: Response, next: NextFunction) {
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

      const admin = this.adminService.findOne({ id: payload.sub });

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
