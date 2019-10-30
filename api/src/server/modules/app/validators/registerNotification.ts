import { joi, validateAsPromise } from 'validators';

const schema = joi.object().keys({
  notificationToken: joi.string().required(),
  deviceId: joi.string().required()
});

export function validate(model: any): Promise<{
  notificationToken: string,
  deviceId: string
}> {
  return validateAsPromise(model, schema);
}