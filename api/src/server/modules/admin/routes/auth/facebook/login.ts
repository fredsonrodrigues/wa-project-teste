import * as facebookService from 'services/social/facebook';
import { NextFunction, Request, Response } from 'express';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.redirect(await facebookService.loginUrl());
  } catch (err) {
    next(err);
  }

}