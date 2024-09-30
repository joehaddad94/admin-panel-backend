import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { throwUnauthorized } from '../base/errors/errors';

@Injectable()
class ExampleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const admin = req['admin'];

    throwUnauthorized({
      errorCheck: !admin || admin.role !== 'finance',
    });

    next();
  }
}
