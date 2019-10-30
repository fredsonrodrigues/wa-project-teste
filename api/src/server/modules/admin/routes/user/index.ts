import { Router } from 'express';
import { enRoles } from 'interfaces/models/user';
import { authRequired } from 'middlewares/authRequired';

import { list } from './list';
import { remove } from './remove';
import { roles } from './roles';
import { save } from './save';

export const router = Router();

router.use(authRequired(enRoles.admin));

router.get('/', list);
router.get('/roles', roles);
router.delete('/:userId', remove);
router.post('/', save);