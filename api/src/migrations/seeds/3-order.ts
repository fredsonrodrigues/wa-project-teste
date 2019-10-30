import * as Knex from 'knex';

import { IOrder } from '../../server/interfaces/models/order';
import { IS_DEV } from '../../server/settings';

export async function seed(knex: Knex): Promise<void> {
  if (!IS_DEV) return;

  const users = await knex
    .count()
    .from('Order')
    .first();

  if (Number(users.count) !== 1) return;

  for (let x = 0; x < 10; x++) {

    const order: IOrder = {
      amount: '4',
      description: 'Suco de Uva',
      value: 'R$ 25,00'
    };

    await knex.insert(order).into('Order');
  }
}