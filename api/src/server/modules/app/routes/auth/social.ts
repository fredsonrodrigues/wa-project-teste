import { NextFunction, Request, Response } from 'express';
import * as socialService from 'services/social';

import * as authSocialService from '../../services/authSocial';
import * as validaotr from '../../validators/loginSocial';

export async function social(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const model = await validaotr.validate(req.body);
    const socialUser = await socialService.getUserInfo(model.provider, model.accessToken);

    const result = await authSocialService.login(socialUser, model);
    res.json(result);
  } catch (err) {

    switch (err.message) {
      case 'user-not-found':
        res.status(400).send('invalid-credentials');
        break;
      default:
        next(err);
        break;
    }

  }
}