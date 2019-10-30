import * as authService from '../../services/auth';
import * as validator from '../../validators/sendResetPassword';
import { NextFunction, Request, Response } from 'express';

export async function sendResetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {email} = await validator.validate(req.body);
    await authService.sendResetPassword(email);
    res.json();
  } catch (err) {

    switch (err.message) {
      case 'email-required':
        res.status(400).send();
        break;
      case 'user-not-found':
        res.status(404).send();
        break;
      default:
        next(err);
        break;
    }

  }
}