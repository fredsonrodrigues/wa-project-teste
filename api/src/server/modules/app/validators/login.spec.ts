import * as joi from 'joi';
import * as _ from 'lodash';

import { validate } from './login';

describe('app/validators/login', () => {
  const data = {
    email: 'email@test.com',
    password: 'senha',
    deviceId: 'deviceId',
    deviceName: 'deviceName',
    notificationToken: 'a680e84f-334b-4556-b797-0070ad78f45d'
  };

  it('should return valid for a full object', async () => {
    const model = data;
    return expect(validate(model)).toResolve();
  });

  it('should return invalid when email is empty', async () => {
    const model = _.clone(data);
    delete model.email;
    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue;
    expect(err.message).toHaveLength(1);
    expect(err.message[0].path).toEqual('email');
    expect(err.message[0].type).toEqual('any.required');
  });

  it('should return invalid when password is empty', async () => {
    const model = _.clone(data);
    delete model.password;
    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue;
    expect(err.message).toHaveLength(1);
    expect(err.message[0].path).toEqual('password');
    expect(err.message[0].type).toEqual('any.required');
  });

  it('should return invalid when deviceId is empty', async () => {
    const model = _.clone(data);
    delete model.deviceId;
    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue;
    expect(err.message).toHaveLength(1);
    expect(err.message[0].path).toEqual('deviceId');
    expect(err.message[0].type).toEqual('any.required');
  });

  it('should return invalid when deviceName is empty', async () => {
    const model = _.clone(data);
    delete model.deviceName;
    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue;
    expect(err.message).toHaveLength(1);
    expect(err.message[0].path).toEqual('deviceName');
    expect(err.message[0].type).toEqual('any.required');
  });

});