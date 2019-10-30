import { Router } from 'express';

import { callback } from './callback';
import { login } from './login';

export const router = Router();
router.get('/', login);
router.get('/callback', callback);