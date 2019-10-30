import { NextFunction, Request, Response } from 'express';
import { enRoles } from 'interfaces/models/user';
import * as _ from 'lodash';

export function authRequired(roles: enRoles | enRoles[] = null): any {

  return (req: Request, res: Response, next: NextFunction): any => {
    if (req.method === 'OPTIONS') {
      return next();
    }

    if (!req.user) {
      return res.status(401).json('Login Required');
    }

    if (!roles) {
      return next();
    }

    roles = _.flattenDeep([roles, ['sysAdmin', 'admin'] as any]) as enRoles[];

    const isAuthorized = _.intersection(roles, req.user.roles).length > 0;
    if (!isAuthorized) {
      return res.status(403).json('Access Denied');
    }

    return next();
  };

}
