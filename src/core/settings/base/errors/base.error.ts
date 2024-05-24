import { HttpException, HttpStatus } from '@nestjs/common';

export const throwError = (message: string, httpStatus: HttpStatus) => {
  throw new HttpException(message, httpStatus);
};
