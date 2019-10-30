import { joi, validateAsPromise } from 'validators';

const schema = joi.object().keys({
  accessToken: joi.string().required(),
  provider: joi.string().required().valid('facebook').valid('google'),
  deviceId: joi.string().required(),
  deviceName: joi.string().required(),
  notificationToken: joi.string().allow(null)
});

export function validate(model: any): Promise<{
  accessToken: string;
  provider: 'facebook' | 'google';
  deviceId: string;
  deviceName: string;
  notificationToken?: string;
}> {
  return validateAsPromise<any>(model, schema);
}