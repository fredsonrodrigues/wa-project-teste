import { NextFunction, Request, Response } from 'express';

import { ServiceError } from '../errors/service';
import * as logService from '../services/log';
import { IS_DEV } from '../settings';

export function notFound(req: Request, res: Response): any {
  return res.status(404).json('Nenhum rota encontrada');
}

export function parser(err: any, req: Request, res: Response, next: NextFunction): any {
  if (err.validationError) {
    if (IS_DEV) {
      console.log(req.body);
      console.log(err.message);
    }

    return res.status(400).json(err.message);
  }

  switch (err.message) {
    case 'not-found':
      err.status = 404;
      break;
    case 'access-denied':
      err.status = 403;
      break;
  }

  if (err instanceof ServiceError) {
    return res.status((<any>err).status || 400).send({ message: err.message, data: err.data });
  }

  next(err);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function developmentError(err: any, req: Request, res: Response, next: NextFunction): any {
  console.error(err.status || 500);
  console.error(err.message);
  console.error(err.stack);
  console.log(req.headers);
  console.log(req.body);

  if (typeof err === 'string') {
    err = { message: err };
  }

  res.status(err.status || 500).send({
    message: err.message,
    stack: err.stack
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function productionError(err: any, req: Request, res: Response, next: NextFunction): Promise<void> {
  err.status = err.status || 500;

  if (err.status === 500) {
    err.errorData = {
      user: req.user,
      req: {
        method: req.method,
        url: req.originalUrl,
        queryString: req.params,
        body: req.body,
      }
    };

    logService.exception(err);
  }

  res.status(err.status).send('Internal Server Error');
}