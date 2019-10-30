import { NextFunction, Request, Response } from 'express';
import { validate } from 'validators/pagination';

import * as userRepository from '../../repositories/user';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const params = await validate(req.query, ['fullName', 'email', 'createdDate', 'updatedDate']);
    const data = await userRepository.list(params);

    res.json({
      ...data,
      ...params
    });
  } catch (err) {
    next(err);
  }
}