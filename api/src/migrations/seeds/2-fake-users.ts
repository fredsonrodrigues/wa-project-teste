import * as faker from 'faker/locale/pt_BR';
import * as Knex from 'knex';

import { IUser } from '../../server/interfaces/models/user';
import { IS_DEV } from '../../server/settings';

export async function seed(knex: Knex): Promise<void> {
  if (!IS_DEV) return;

  const users = await knex
    .count()
    .from('User')
    .first();

  if (Number(users.count) !== 1) return;

  const bcrypt = await import('../../server/services/bcrypt');
  const password = await bcrypt.hash('senha@123');

  for (let x = 0; x < 100; x++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    const user: IUser = {
      firstName,
      lastName,
      email: faker.internet.email(`${lastName}_${x}`, firstName),
      password,
      roles: 'user' as any,
      createdDate: new Date(),
      updatedDate: new Date()
    };

    await knex.insert(user).into('User');
  }
}