import { BaseErrorParams, ForbiddenParams, NotFoundParams } from 'src/core/data/types/errors/base.error.types';
export declare const throwInternalError: (data?: BaseErrorParams) => void;
export declare const throwNotFound: (data?: NotFoundParams) => void;
export declare const throwUnauthorized: (data?: BaseErrorParams) => void;
export declare const throwForbidden: (data?: ForbiddenParams) => void;
export declare const throwBadRequest: (data?: BaseErrorParams) => void;
