import { IUser } from 'interfaces/models/user';
import * as joi from 'joi';
import * as lodash from 'lodash';

import { validate } from './profile';

describe('app/validators/user', () => {
  const data: Partial<IUser> = {
    id: 1,
    firstName: 'Daniel',
    lastName: 'Prado',
    email: 'email@test.com'
  };

  it('should return valid for a minimun object', async () => {
    const model = { firstName: data.firstName, email: data.email };
    return expect(validate(model)).toResolve();
  });

  it('should return valid for a full object', async () => {
    const model = data;
    return expect(validate(model)).toResolve();
  });

  it('should return invalid when id is less than 1', async () => {
    const model = lodash.clone(data);
    model.id = 0;

    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue();
    expect(err.message).toHaveLength(1);
    expect(err.message[0].path).toEqual('id');
    expect(err.message[0].type).toEqual('number.min');
  });

  it('should return invalid when firstName is empty', async () => {
    const model = lodash.clone(data);
    delete model.firstName;

    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue();
    expect(err.message).toHaveLength(1);
    expect(err.message[0].path).toEqual('firstName');
    expect(err.message[0].type).toEqual('any.required');
  });

  it('should return invalid when firstName length is less than 3', async () => {
    const model = lodash.clone(data);
    model.firstName = 'te';

    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue();
    expect(err.message).toHaveLength(1);
    expect(err.message[0].path).toEqual('firstName');
    expect(err.message[0].type).toEqual('string.min');
  });

  it('should return invalid when firstName length is greather than 50', async () => {
    const model = lodash.clone(data);
    model.firstName = new Array(52).join('a');

    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue();
    expect(err.message).toHaveLength(1);
    expect(err.message[0].path).toEqual('firstName');
    expect(err.message[0].type).toEqual('string.max');
  });

  it('should return invalid when lastName length is greather than 50', async () => {
    const model = lodash.clone(data);
    model.lastName = new Array(52).join('a');

    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue();
    expect(err.message).toHaveLength(1);
    expect(err.message[0].path).toEqual('lastName');
    expect(err.message[0].type).toEqual('string.max');
  });

  it('should return invalid when email is empty', async () => {
    const model = lodash.clone(data);
    delete model.email;

    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue();
    expect(err.message).toHaveLength(1);
    expect(err.message[0].path).toEqual('email');
    expect(err.message[0].type).toEqual('any.required');
  });

  it('should return invalid when email is invalid', async () => {
    const model = lodash.clone(data);
    model.email = 'invalid email address';

    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue();
    expect(err.message).toHaveLength(1);
    expect(err.message[0].path).toEqual('email');
    expect(err.message[0].type).toEqual('string.email');
  });

  it('should return invalid when email length is greather than 150', async () => {
    const model = lodash.clone(data);
    model.email = new Array(152).join('a');

    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue();
    expect(err.message.some(m => m.path == 'email' && m.type == 'string.max')).toBeTrue();
  });

});