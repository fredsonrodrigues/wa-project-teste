import { IOrder } from 'interfaces/models/order';
import { joi, validateAsPromise } from 'validators';

const schema = joi.object().keys({
  id: joi.number().min(1),
  description: joi.string().trim().required().min(3).max(50),
  amount: joi.string().trim().max(50),
  value: joi.string().trim().required().max(10)
});

export function validate(model: any): Promise<IOrder> {
  return validateAsPromise<any>(model, schema);
}