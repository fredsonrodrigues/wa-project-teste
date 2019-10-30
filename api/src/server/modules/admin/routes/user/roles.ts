import { NextFunction, Request, Response } from 'express';
import { enRoles, listPublicRoles } from 'interfaces/models/user';

type typeRoleDescription = {
  [key in keyof typeof enRoles]?: {
    name: string;
    description?: string;
  };
};

export function roles(req: Request, res: Response, next: NextFunction): void {
  try {
    const roles = listPublicRoles();
    const rolesDescriptions: typeRoleDescription = {
      admin: {
        name: 'Administrador',
        description: 'Acesso total a todas as funcionalidades'
      },
      user: {
        name: 'Usuário',
        description: 'Accesso Limitado'
      }
    };

    const result = roles
      .map(role => ({
        role,
        ...rolesDescriptions[role]
      }))
      .filter(role => role);

    res.json(result);
  } catch (err) {
    next(err);
  }
}