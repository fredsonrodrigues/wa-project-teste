import * as authService from '../../services/auth';
import * as loginValidator from '../../validators/login';
import { NextFunction, Request, Response } from 'express';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {email, password} = await loginValidator.validate(req.body);
    const token = await authService.login(email, password);

    res.setHeader('X-Token', token);
    res.json(token);
  } catch (err) {

    switch (err.message) {
      case 'user-not-found':
      case 'invalid-password':
        res.status(400).send();
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