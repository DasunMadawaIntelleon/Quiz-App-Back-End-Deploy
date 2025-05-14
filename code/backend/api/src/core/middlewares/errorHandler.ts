import { ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

const errorHandler = (err: any, req: Request, res: Response, next:NextFunction): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Invalid or malformed request",
      errors: err.errors.map((e: any) => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
  } else if (err.statusCode) {
   
    res.status(err.statusCode).json({
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  } else {
    logger.error(`Internal server error`, err.stack);
    res.status(500).json({
      message: 'Internal server error',
      error: 'Unexpected error occurred'
    });
  }
};

export default errorHandler;
