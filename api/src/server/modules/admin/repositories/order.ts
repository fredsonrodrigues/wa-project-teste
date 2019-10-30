import { IPaginationParams } from 'interfaces/pagination';
import { Transaction } from 'knex';
import { Order } from 'models/order';
import { Page } from 'objection';

export async function list(params: IPaginationParams, transaction?: Transaction): Promise<Page<Order>> {
  let query = Order
    .query(transaction)
    .select('*')
    .page(params.page, params.pageSize);

  if (params.term) {
    query = query.where(query => {
      return query
        .where('description', 'ilike', `%${params.term}%`)
        .orWhere('amount', 'ilike', `%${params.term}%`)
        .orWhere('value', 'ilike', `%${params.term}%`);
    });
  }
  return await query;
}