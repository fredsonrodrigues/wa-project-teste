import { Router } from 'express';

import { autoRenewToken } from '../middlewares/renewToken';
import { router as authRouter } from './auth';
import { router as profileRouter } from './profile';

export const router = Router({ mergeParams: true });

router.use(autoRenewToken);

router.use('/auth', authRouter);
router.use('/profile', profileRouter);