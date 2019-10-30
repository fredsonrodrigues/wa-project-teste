import * as _ from 'lodash';

import { validate } from './changePassword';

describe('admin/validators/changePassword', () => {
  const data = {
    currentPassword: 'token',
    newPassword: 'senha'
  };

  it('should return valid for a full object', async () => {
    const model = data;
    return expect(validate(model)).toResolve();
  });

  it('should return invalid when currentPassword is empty', async () => {
    const model = _.clone(data);
    delete model.currentPassword;

    const promise = validate(model);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('currentPassword');
    expect(result.message[0].type).toEqual('any.required');
  });

  it('should return invalid when newPassword is empty', async () => {
    const model = _.clone(data);
    delete model.newPassword;

    const promise = validate(model);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('newPassword');
    expect(result.message[0].type).toEqual('any.required');
  });

  it('should return invalid when newPassword length is less than 3', async () => {
    const model = _.clone(data);
    model.newPassword = 'te';

    const promise = validate(model);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('newPassword');
    expect(result.message[0].type).toEqual('string.min');

  });

  it('should return invalid when newPassword length is greather than 100', async () => {
    const model = _.clone(data);
    model.newPassword = new Array(102).join('a');

    const promise = validate(model);
    await expect(promise).toReject();

    const result = await promise.catch(err => err);
    expect(result.validationError).toBeTrue();
    expect(result.message).toHaveLength(1);
    expect(result.message[0].path).toEqual('newPassword');
    expect(result.message[0].type).toEqual('string.max');
  });
});