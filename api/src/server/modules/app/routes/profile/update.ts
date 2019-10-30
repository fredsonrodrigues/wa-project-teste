import { NextFunction, Request, Response } from 'express';

import * as profileService from '../../services/profile';
import * as profileValidator from '../../validators/profile';

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const model = await profileValidator.validate(req.body);
    const profile = await profileService.save(model, req.user);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}