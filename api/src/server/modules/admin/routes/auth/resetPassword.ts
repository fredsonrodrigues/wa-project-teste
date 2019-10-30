import * as authService from '../../services/auth';
import * as validator from '../../validators/resetPassword';
import { NextFunction, Request, Response } from 'express';

export async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {token, password} = await validator.validate(req.body);
    await authService.resetPassword(token, password);
    res.json();
  } catch (err) {

    switch (err.message) {
      case 'token-invalid':
      case 'token-type-not-match':
      case 'user-not-found':
        res.status(400).send('token-invalid');
        break;
      default:
        next(err);
        break;
    }

  }
}