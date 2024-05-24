import { HttpStatus } from '@nestjs/common';
import { throwError } from './base.error';
import {
  BaseErrorParams,
  ForbiddenParams,
  NotFoundParams,
} from 'src/core/data/types/errors/base.error.types';

export const throwInternalError = (data?: BaseErrorParams) => {
  const { message } = data;

  throwError(message, HttpStatus.INTERNAL_SERVER_ERROR);
};

export const throwNotFound = (data?: NotFoundParams) => {
  const { message, entity, errorCheck } = data;

  if (errorCheck ?? true) {
    const entityString: string = entity !== null ? `${entity} ` : '';

    throwError(message ?? `${entityString}Not Found`, HttpStatus.NOT_FOUND);
  }
};

export const throwUnauthorized = (data?: BaseErrorParams) => {
  const { message, errorCheck } = data;

  if (errorCheck ?? true) {
    throwError(message ?? 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }
};

export const throwForbidden = (data?: ForbiddenParams) => {
  const { message, action, errorCheck } = data;

  if (errorCheck ?? true) {
    const actionString: string = action !== null ? `${action} ` : '';

    throwError(message ?? `${actionString}Forbidden`, HttpStatus.FORBIDDEN);
  }
};

export const throwBadRequest = (data?: BaseErrorParams) => {
  const { message, errorCheck } = data;

  if (errorCheck ?? true) {
    throwError(message ?? 'Bad Request', HttpStatus.BAD_REQUEST);
  }
};
