import { Router } from 'express';
import { authRequired } from 'middlewares/authRequired';

import { login } from './login';
import { logout } from './logout';
import { opened } from './opened';
import { social } from './social';

export const router = Router({ mergeParams: true });

router.post('/login', login);
router.post('/social/login', social);

router.use(authRequired());
router.post('/logout', logout);
router.post('/opened', opened);
