export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_CONTENT: 422,
    INTERNAL_SERVER_ERROR: 500,
  } as const;
  
  export type HttpStatus = typeof HttpStatus[keyof typeof HttpStatus];
  
  export interface AppError extends Error {
    statusCode: HttpStatus;
  }
  
  export const createError = (statusCode: HttpStatus, message: string): AppError => {
    const error = new Error(message) as AppError;
    error.statusCode = statusCode;
    return error;
  };
  