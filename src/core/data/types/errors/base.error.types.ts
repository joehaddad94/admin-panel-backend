export interface BaseErrorParams {
  message?: string;
  errorCheck?: boolean;
}

export interface NotFoundParams extends BaseErrorParams {
  entity?: string;
}

export interface ForbiddenParams extends BaseErrorParams {
  action?: string;
}
