//  forwarding requests to the correct controller

import { Express, Request, Response } from 'express';
import { createUserHandler } from './controllers/user.controller';
import { validateResource } from './middleware/validateResource';
import { createUserSchema } from './schema/user.schema';
import {
  createUserSessionHandler,
  deleteUserSessionHandler,
  getUserSessionsHandler,
} from './controllers/session.controller';
import { createSessionSchema } from './schema/session.schema';
import { requireUser } from './middleware/requireUser';
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  updateProductHandler,
} from './controllers/product.controller';
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from './schema/product.schema';

export default function routes(app: Express) {
  //  health check is a simple way to verify that a service or application is up and running.
  app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post('/api/users', validateResource(createUserSchema), createUserHandler);
  app.post(
    '/api/sessions',
    validateResource(createSessionSchema),
    createUserSessionHandler,
  );

  app.get('/api/sessions', requireUser, getUserSessionsHandler);
  app.delete('/api/sessions', requireUser, deleteUserSessionHandler);
  app.post(
    '/api/products',
    [requireUser, validateResource(createProductSchema)],
    createProductHandler,
  );
  // app.post(
  //   '/api/products/:productId',
  //   [requireUser, validateResource(createProductSchema)],
  //   createProductHandler,
  // );

  app.put(
    '/api/products/:productId',
    [requireUser, validateResource(updateProductSchema)],
    updateProductHandler,
  );

  app.get(
    '/api/products/:productId',
    validateResource(getProductSchema),
    getProductHandler,
  );

  app.delete(
    '/api/products/:productId',
    [requireUser, validateResource(deleteProductSchema)],
    deleteProductHandler,
  );
}
