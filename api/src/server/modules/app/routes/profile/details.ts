import { NextFunction, Request, Response } from 'express';

import * as userRepository from '../../repositories/user';

export async function details(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profile = await userRepository.findById(req.user.id);

    if (!profile) {
      res.status(404).json('not-found');
      return;
    }

    res.json(profile);
  } catch (err) {
    next(err);
  }
}