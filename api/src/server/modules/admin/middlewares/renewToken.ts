import { NextFunction, Request, Response } from 'express';
import * as tokenService from 'services/token';
import { AUTH } from 'settings';

export async function autoRenewToken(req: Request, res: Response, next: NextFunction): Promise<any> {
  if (req.method === 'OPTIONS' || !req.user) {
    return next();
  }

  const now = Math.floor(Date.now() / 1000) * 1;
  const diff = (<any>req.user).exp - now;

  if (diff <= (AUTH.timeout * 0.6)) {
    const token = await tokenService.renewUserToken(req.user);
    res.setHeader('X-Token', token);
  }

  return next();
}