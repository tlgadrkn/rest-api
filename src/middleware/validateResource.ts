// when a request comes in, we're gonna provide a schema in the middleware that will validate the request against the schema

import { AnyZodObject } from 'zod';
import { NextFunction, Request, Response } from 'express';

export const validateResource =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      return res.status(400).json({ error: error.errors });
    }
  };
