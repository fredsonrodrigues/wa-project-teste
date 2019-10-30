import { IPaginationParams } from 'interfaces/pagination';
import { joi, validateAsPromise } from 'validators';

export async function validate(model: any, orderByColumns: string[]): Promise<IPaginationParams> {
  const schema = joi.object().keys({
    term: joi.string().allow('').allow(null).trim(),
    page: joi.number().required().min(0),
    pageSize: joi.number().required().min(1),
    orderBy: joi.string().allow('').allow(null).trim().only(orderByColumns),
    orderDirection: joi.string().allow('').allow(null).trim().only('asc', 'desc')
  });

  return await validateAsPromise<any>(model, schema);
}