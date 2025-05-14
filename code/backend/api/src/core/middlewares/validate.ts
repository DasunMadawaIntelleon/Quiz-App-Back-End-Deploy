import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    const validationObject: { body?: any; params?: any; query?: any; } = {};

    if ('body' in schema.shape) validationObject.body = req.body;
    if ('params' in schema.shape) validationObject.params = req.params;
    if ('query' in schema.shape) validationObject.query = req.query;

    schema.parse(validationObject);
    next();
  } catch (error) {
    next(error);
  }
};

export default validate;
