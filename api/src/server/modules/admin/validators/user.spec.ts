import { enRoles, IUser } from 'interfaces/models/user';
import * as joi from 'joi';
import * as lodash from 'lodash';

import { validate } from './user';

describe('admin/validators/user', () => {
  const sample: IUser = {
    id: 1,
    firstName: 'Daniel',
    lastName: 'Prado',
    email: 'email@test.com',
    roles: [enRoles.admin]
  };

  it('should return valid for a minimun object', async () => {
    const model = { firstName: sample.firstName, email: sample.email, roles: [enRoles.admin] };
    return expect(validate(model)).toResolve();
  });

  it('should return valid for a full object', async () => {
    const model = sample;
    return expect(validate(model)).toResolve();
  });

  it('should return invalid when id is less than 1', async () => {
    const model = lodash.clone(sample);
    model.id = 0;
    const promise = validate(model);
    await expect(promise).toReject();

    const data: joi.CustomValidationError = await promise.catch(err => err);
    expect(data.validationError).toBeTrue();
    expect(data.message).toHaveLength(1);
    expect(data.message[0].path).toEqual('id');
    expect(data.message[0].type).toEqual('number.min');
  });

  it('should return invalid when firstName is empty', async () => {
    const model = lodash.clone(sample);
    delete model.firstName;
    const promise = validate(model);
    await expect(promise).toReject();

    const data: joi.CustomValidationError = await promise.catch(err => err);
    expect(data.validationError).toBeTrue();
    expect(data.message).toHaveLength(1);
    expect(data.message[0].path).toEqual('firstName');
    expect(data.message[0].type).toEqual('any.required');
  });

  it('should return invalid when firstName length is less than 3', async () => {
    const model = lodash.clone(sample);
    model.firstName = 'te';
    const promise = validate(model);
    await expect(promise).toReject();

    const data: joi.CustomValidationError = await promise.catch(err => err);
    expect(data.validationError).toBeTrue();
    expect(data.message).toHaveLength(1);
    expect(data.message[0].path).toEqual('firstName');
    expect(data.message[0].type).toEqual('string.min');
  });

  it('should return invalid when firstName length is greather than 50', async () => {
    const model = lodash.clone(sample);
    model.firstName = new Array(52).join('a');
    const promise = validate(model);
    await expect(promise).toReject();

    const data: joi.CustomValidationError = await promise.catch(err => err);
    expect(data.validationError).toBeTrue();
    expect(data.message).toHaveLength(1);
    expect(data.message[0].path).toEqual('firstName');
    expect(data.message[0].type).toEqual('string.max');
  });

  it('should return invalid when lastName length is greather than 50', async () => {
    const model = lodash.clone(sample);
    model.lastName = new Array(52).join('a');
    const promise = validate(model);
    await expect(promise).toReject();

    const data: joi.CustomValidationError = await promise.catch(err => err);
    expect(data.validationError).toBeTrue();
    expect(data.message).toHaveLength(1);
    expect(data.message[0].path).toEqual('lastName');
    expect(data.message[0].type).toEqual('string.max');
  });

  it('should return invalid when email is empty', async () => {
    const model = lodash.clone(sample);
    delete model.email;
    const promise = validate(model);
    await expect(promise).toReject();

    const data: joi.CustomValidationError = await promise.catch(err => err);
    expect(data.validationError).toBeTrue();
    expect(data.message).toHaveLength(1);
    expect(data.message[0].path).toEqual('email');
    expect(data.message[0].type).toEqual('any.required');
  });

  it('should return invalid when email is invalid', async () => {
    const model = lodash.clone(sample);
    model.email = 'invalid email address';
    const promise = validate(model);
    await expect(promise).toReject();

    const data: joi.CustomValidationError = await promise.catch(err => err);
    expect(data.validationError).toBeTrue();
    expect(data.message).toHaveLength(1);
    expect(data.message[0].path).toEqual('email');
    expect(data.message[0].type).toEqual('string.email');
  });

  it('should return invalid when email length is greather than 150', async () => {
    const model = lodash.clone(sample);
    model.email = new Array(152).join('a');
    const promise = validate(model);
    await expect(promise).toReject();

    const data: joi.CustomValidationError = await promise.catch(err => err);
    expect(data.validationError).toBeTrue();
    expect(data.message.some(m => m.path == 'email' && m.type == 'string.max')).toBeTrue();
  });

  it('should return invalid when roles is not present', async () => {
    const model = lodash.clone(sample);
    delete model.roles;
    const promise = validate(model);
    await expect(promise).toReject();

    const data: joi.CustomValidationError = await promise.catch(err => err);
    expect(data.validationError).toBeTrue();
    expect(data.message).toHaveLength(1);
    expect(data.message[0].path).toEqual('roles');
    expect(data.message[0].type).toEqual('any.required');
  });

  it('should return invalid when roles is empty', async () => {
    const model = { ...sample, roles: [] as any };
    const promise = validate(model);
    await expect(promise).toReject();

    const data: joi.CustomValidationError = await promise.catch(err => err);
    expect(data.validationError).toBeTrue();
    expect(data.message).toHaveLength(1);
    expect(data.message[0].path).toEqual('roles');
    expect(data.message[0].type).toEqual('array.min');
  });

  it('should return invalid when roles is duplicated', async () => {
    const model = { ...sample, roles: [enRoles.admin, enRoles.admin] };
    const promise = validate(model);
    await expect(promise).toReject();

    const data: joi.CustomValidationError = await promise.catch(err => err);
    expect(data.validationError).toBeTrue();
    expect(data.message).toHaveLength(1);
    expect(data.message[0].path).toEqual('roles.1');
    expect(data.message[0].type).toEqual('array.unique');
  });

  it('shoud return invalid when an invalid role is added', async () => {
    const model = lodash.clone(sample);
    model.roles = ['nothing'] as any;
    const promise = validate(model);
    await expect(promise).toReject();

    const data: joi.CustomValidationError = await promise.catch(err => err);
    expect(data.validationError).toBeTrue();
    expect(data.message).toHaveLength(1);
    expect(data.message[0].path).toEqual('roles.0');
    expect(data.message[0].type).toEqual('any.allowOnly');
  });

});