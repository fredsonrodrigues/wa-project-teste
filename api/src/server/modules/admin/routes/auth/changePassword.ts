import * as authService from '../../services/auth';
import * as validator from '../../validators/changePassword';
import { NextFunction, Request, Response } from 'express';

export async function changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {currentPassword, newPassword} = await validator.validate(req.body);
    await authService.changePassword(req.user, currentPassword, newPassword);
    res.json();
  } catch (err) {

    switch (err.message) {
      case 'invalid-password':
        res.status(400).send('invalid-password');
        break;
      default:
        next(err);
        break;
    }

  }
}