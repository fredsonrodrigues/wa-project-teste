import { joi, validateAsPromise } from 'validators';

const schema = joi.object().keys({
  token: joi.string().trim().required(),
  password: joi.string().trim().required().min(5).max(20)
});

export function validate(model: any): Promise<{ token: string, password: string }> {
  return validateAsPromise<any>(model, schema);
}