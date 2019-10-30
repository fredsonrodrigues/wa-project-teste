import { Router } from 'express';

import { autoRenewToken } from '../middlewares/renewToken';
import { router as authRouter } from './auth';
import { router as userRouter } from './user';
import { router as orderRouter } from './order';

export const router = Router();

router.use('/auth', authRouter);

router.use(autoRenewToken);

router.use('/user', userRouter);

router.use('/order', orderRouter);