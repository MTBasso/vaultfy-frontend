export interface CustomError extends Error {
  statusCode: number;
  message: string;
}

export function isCustomError(error: any): error is CustomError {
  return (error as CustomError).statusCode !== undefined;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Invalid parameters') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error.') {
    super(message, 500);
    this.name = 'InternalServerError';
  }
}
