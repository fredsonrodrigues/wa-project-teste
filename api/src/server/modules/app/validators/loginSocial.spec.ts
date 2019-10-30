import * as joi from 'joi';
import * as _ from 'lodash';

import { validate } from './loginSocial';

describe('app/validators/loginSocial', () => {
  const data = {
    accessToken: 'accessToken',
    deviceId: 'deviceId',
    application: 'application',
    deviceName: 'deviceName',
    provider: 'facebook',
    notificationToken: 'a680e84f-334b-4556-b797-0070ad78f45d'
  };

  it('should return valid for a minimum object', async () => {
    const model = _.clone(data);
    delete model.notificationToken;
    return expect(validate(data)).toResolve();
  });

  it('should return valid for a full object', async () => {
    return expect(validate(data)).toResolve();
  });

  it('should return invalid when accessToken is empty', async () => {
    const model = _.clone(data);
    delete model.accessToken;
    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue;
    expect(err.message).toHaveLength(1);
    expect(err.message[0].path).toEqual('accessToken');
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

  it('should return invalid when provider is empty', async () => {
    const model = _.clone(data);
    delete model.provider;
    const promise = validate(model);
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.validationError).toBeTrue;
    expect(err.message).toHaveLength(1);
    expect(err.message[0].path).toEqual('provider');
    expect(err.message[0].type).toEqual('any.required');
  });

});