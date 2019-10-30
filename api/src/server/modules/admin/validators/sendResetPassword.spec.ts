import * as _ from 'lodash';

import { validate } from './sendResetPassword';

describe('admin/validators/sendResetPassword', () => {
  const data = {
    email: 'admin@waproject.com.br'
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

  it('should return invalid when email is invalid', async () => {
    const model = _.clone(data);
    model.email = 'invalid';

    const promise = validate(model);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('email');
    expect(result.message[0].type).toEqual('string.email');
  });

});