import * as _ from 'lodash';

import { validate } from './resetPassword';

describe('admin/validators/resetPassword', () => {
  const data = {
    token: 'token',
    password: 'senha'
  };

  it('should return valid for a full object', async () => {
    const model = data;
    return expect(validate(model)).toResolve();
  });

  it('should return invalid when token is empty', async () => {
    const model = _.clone(data);
    delete model.token;

    const promise = validate(model);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('token');
    expect(result.message[0].type).toEqual('any.required');
  });

  it('should return invalid when password is empty', async () => {
    const model = _.clone(data);
    delete model.password;

    const promise = validate(model);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('password');
    expect(result.message[0].type).toEqual('any.required');

  });

  it('should return invalid when password length is less than 3', async () => {
    const model = _.clone(data);
    model.password = 'te';

    const promise = validate(model);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('password');
    expect(result.message[0].type).toEqual('string.min');

  });

  it('should return invalid when password length is greather than 100', async () => {
    const model = _.clone(data);
    model.password = new Array(102).join('a');

    const promise = validate(model);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('password');
    expect(result.message[0].type).toEqual('string.max');
  });

});