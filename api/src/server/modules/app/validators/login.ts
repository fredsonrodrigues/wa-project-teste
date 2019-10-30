import { joi, validateAsPromise } from 'validators';

const schema = joi.object().keys({
  email: joi.string().trim().email().required(),
  password: joi.string().trim().required(),
  deviceId: joi.string().required(),
  deviceName: joi.string().required(),
  notificationToken: joi.string().allow(null)
});

export function validate(model: any): Promise<{
  email: string,
  password: string,
  deviceId: string,
  deviceName: string,
  notificationToken?: string,
}> {
  return validateAsPromise<any>(model, schema);
}
