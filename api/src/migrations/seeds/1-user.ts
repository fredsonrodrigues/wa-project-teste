import * as Knex from 'knex';

import { IUser } from '../../server/interfaces/models/user';

export async function seed(knex: Knex): Promise<void> {
  const adminUser: IUser = {
    firstName: 'WaProject',
    lastName: 'Admin',
    email: 'admin@waproject.com.br',
    password: 'senha@123',
    roles: 'sysAdmin' as any,
    createdDate: new Date(),
    updatedDate: new Date()
  };

  const users = await knex
    .count()
    .from('User')
    .where({ email: adminUser.email })
    .first();

  if (Number(users.count) > 0) return;

  const bcrypt = await import('../../server/services/bcrypt');
  adminUser.password = await bcrypt.hash(adminUser.password);

  await knex.insert(adminUser).into('User');
}