import { NextFunction, Request, Response } from 'express';

import * as googleService from '../../../../../services/social/google';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.redirect(await googleService.loginUrl());
  } catch (err) {
    next(err);
  }

}