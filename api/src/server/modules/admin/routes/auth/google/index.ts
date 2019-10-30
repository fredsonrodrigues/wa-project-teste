import { callback } from './callback';
import { login } from './login';
import { Router } from 'express';

export const router = Router();
router.get('/', login);
router.get('/callback', callback);