import { NextFunction, Request, Response } from 'express';

import * as orderRepository from '../../repositories/order';
import * as orderValidator from '../../validators/order';

export async function save(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const model = await orderValidator.validate(req.body);
    const user = await orderRepository.save(model);
    res.status(model.id ? 200 : 201).json(user);
  } catch (err) {
    next(err);
  }
}