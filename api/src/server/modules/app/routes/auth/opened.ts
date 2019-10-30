import { ServiceError } from 'errors/service';
import { NextFunction, Request, Response } from 'express';

import * as authService from '../../services/auth';
import * as notificationService from '../../services/notification';
import * as registerNotificationValidator from '../../validators/registerNotification';

export async function opened(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.get('RefreshToken');

    if (!refreshToken) {
      res.status(401).send();
      return;
    }

    const token = await authService.generateAccessToken(refreshToken);
    res.setHeader('X-Token', token);

    if (req.body.notificationToken) {
      const model = await registerNotificationValidator.validate(req.body);
      await notificationService.register(model.notificationToken, model.deviceId, req.user);
    }

    res.send();
  } catch (err) {
    if (err instanceof ServiceError && ['device-not-found', 'token-changed'].includes(err.message)) {
      res.status(401).send();
      return;
    }

    next(err);
  }
}