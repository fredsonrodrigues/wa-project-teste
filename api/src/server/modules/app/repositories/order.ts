import { IPaginationParams } from 'interfaces/pagination';
import { Transaction } from 'knex';
import { Order } from 'models/order';
import { Page } from 'objection';

export async function save(model: IOrder, transaction?: Transaction): Promise<Order> {
  return await Order.query(transaction).insert(model);
}