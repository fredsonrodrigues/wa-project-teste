import { NextFunction, Request, Response } from 'express';

import * as authService from '../../services/auth';
import * as loginValidator from '../../validators/login';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const model = await loginValidator.validate(req.body);
    const result = await authService.login(model);

    res.json(result);
  } catch (err) {

    switch (err.message) {
      case 'user-not-found':
      case 'invalid-password':
        res.status(400).send('invalid-credentials');
        break;
      case 'user-no-access':
        res.status(405).send();
        break;
      default:
        next(err);
        break;
    }

  }
}