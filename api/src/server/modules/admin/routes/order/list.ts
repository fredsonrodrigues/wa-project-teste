import { NextFunction, Request, Response } from 'express';
import { validate } from 'validators/pagination';

import * as orderRepository from '../../repositories/order';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const params = await validate(req.query, ['description', 'amount', 'value']);
    const data = await orderRepository.list(params);

    res.json({
      ...data,
      ...params
    });
  } catch (err) {
    next(err);
  }
}