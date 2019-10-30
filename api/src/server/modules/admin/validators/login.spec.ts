import * as _ from 'lodash';

import { validate } from './login';

describe('admin/validators/login', () => {
  const data = {
    email: 'email@test.com',
    password: 'senha'
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

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('email');
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

});