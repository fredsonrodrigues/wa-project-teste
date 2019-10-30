import { NextFunction, Request, Response } from 'express';

import * as userService from '../../services/user';
import * as userValidator from '../../validators/user';

export async function save(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const model = await userValidator.validate(req.body);
    const user = await userService.save(model);
    res.status(model.id ? 200 : 201).json(user);
  } catch (err) {
    if (err.message === 'email-unavailable') {
      res.status(409).json(err);
      return;
    }

    next(err);
  }
}