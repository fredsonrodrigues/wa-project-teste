import { joi, validateAsPromise } from 'validators';

const schema = joi.object().keys({
  currentPassword: joi.string().trim().required(),
  newPassword: joi.string().trim().required().min(5).max(20),
});

export function validate(model: any): Promise<{ currentPassword: string, newPassword: string }> {
  return validateAsPromise<any>(model, schema);
}