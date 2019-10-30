import { joi, validateAsPromise } from 'validators';

interface ILogoutValidatorResult {
  deviceId: string;
  application: string;
}

const schema = joi.object({
  deviceId: joi.string().required()
});

export function validate(model: any): Promise<ILogoutValidatorResult> {
  return validateAsPromise<ILogoutValidatorResult>(model, schema);
}