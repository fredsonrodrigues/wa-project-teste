import { Router } from 'express';
import { authRequired } from 'middlewares/authRequired';

import { changePassword } from './changePassword';
import { login } from './login';
import { resetPassword } from './resetPassword';
import { sendResetPassword } from './sendResetPassword';

export const router = Router();

router.post('/login', login);
router.post('/send-reset', sendResetPassword);
router.post('/reset-password', resetPassword);

router.use(authRequired());

router.post('/change-password', changePassword);
