import { IUser, listPublicRoles } from 'interfaces/models/user';
import { joi, validateAsPromise } from 'validators';

const schema = joi.object().keys({
  id: joi.number().min(1),
  firstName: joi.string().trim().required().min(3).max(50),
  lastName: joi.string().trim().max(50),
  email: joi.string().trim().email().required().max(150),
  roles: joi.array().required().min(1).unique().items(joi.string().trim().valid(...listPublicRoles()))
});

export function validate(model: any): Promise<IUser> {
  return validateAsPromise<any>(model, schema);
}