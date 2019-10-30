import { Router } from 'express';
import { authRequired } from 'middlewares/authRequired';

import { details } from './details';
import { update } from './update';

export const router = Router({ mergeParams: true });

router.use(authRequired());
router.get('/', details);
router.post('/', update);