import { ServiceError } from 'errors/service';
import { NextFunction, Request, Response } from 'express';
import { IUserToken } from 'interfaces/tokens/user';
import { enTokenType } from 'services/token';
import * as tokenService from 'services/token';

export async function bindUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.get('Authorization');
    if (!token) throw '';

    req.user = await tokenService.verify<IUserToken>(token.split(' ')[1], enTokenType.userToken);
  } catch (err) {
    if (!(err instanceof ServiceError)) {
      next(err);
      return;
    }
  }

  next();
}
