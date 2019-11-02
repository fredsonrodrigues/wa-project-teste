import { Router } from 'express';

import { autoRenewToken } from '../middlewares/renewToken';
import { router as authRouter } from './auth';
import { router as profileRouter } from './profile';
import { router as orderRouter } from './order';

export const router = Router({ mergeParams: true });

router.use(autoRenewToken);

router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/order', orderRouter);