import { joi, validateAsPromise } from 'validators';

const schema = joi.object().keys({
  email: joi.string().trim().email().required(),
  password: joi.string().trim().required(),
});

export function validate(model: any): Promise<{ email: string, password: string }> {
  return validateAsPromise<any>(model, schema);
}
