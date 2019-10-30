import { joi, validateAsPromise } from 'validators';

const schema = joi.object().keys({
  email: joi.string().trim().email().required()
});

export function validate(model: any): Promise<{ email: string }> {
  return validateAsPromise<any>(model, schema);
}