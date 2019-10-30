import { NextFunction, Request, Response } from 'express';
import * as facebookService from 'services/social/facebook';
import * as urlService from 'services/url';

import * as authService from '../../../services/auth';

export async function callback(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.query.error && !req.query.code) {
      res.redirect(urlService.home());
      return;
    }

    const accessToken = await facebookService.getAccessToken(req.query.code);
    const userInfo = await facebookService.getUserInfo(accessToken);
    const token = await authService.loginBySocial(userInfo);

    res.redirect(urlService.loginSocial(token));
  } catch (err) {
    if (err.name === 'facebook-error') {
      return res.redirect(urlService.loginMessage('invalid-token'));
    }

    if (err.message === 'user-not-found' || err.message === 'user-no-access') {
      return res.redirect(urlService.loginMessage(err.message));
    }

    next(err);
  }

}