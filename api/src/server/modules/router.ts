import { Router } from 'express';

import { router as adminRouter } from './admin/routes';
import { router as appRouter } from './app/routes';
import { router as contentRouter } from './content/routes';

export const router = Router();

router.use('/admin', adminRouter);
router.use('/content', contentRouter);
router.use('/app', appRouter);