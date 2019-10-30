import { NextFunction, Request, Response } from 'express';

import * as userService from '../../services/user';

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await userService.remove(req.params.userId, req.user);
    res.json();
  } catch (err) {
    next(err);
  }
}