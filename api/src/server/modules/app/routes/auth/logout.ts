import { NextFunction, Request, Response } from 'express';

import * as authService from '../../services/auth';
import { validate } from '../../validators/logout';

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const model = await validate(req.body);
    await authService.logout(req.user, model.deviceId);

    res.json();
  } catch (err) {
    next(err);
  }
}