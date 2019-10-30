import * as authService from '../services/auth';
import * as tokenService from 'services/token';

import { NextFunction, Request, Response } from 'express';

import { IUserToken } from 'interfaces/tokens/user';
import { ServiceError } from 'errors/service';
import { enTokenType } from 'services/token';

export async function autoRenewToken(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const refreshToken = req.get('RefreshToken');

    if (req.method === 'OPTIONS' || req.user || !refreshToken) {
      return next();
    }

    const token = await authService.generateAccessToken(refreshToken);
    req.user = await tokenService.verify<IUserToken>(token, enTokenType.userToken);
    res.setHeader('X-Token', token);
    return next();
  } catch (err) {
    if (err instanceof ServiceError) {
      delete req.user;
      return next();
    }

    next(err);
  }
}