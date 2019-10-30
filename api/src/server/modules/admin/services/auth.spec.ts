import { connectAndMigrate, Connection } from 'db';
import { enRoles } from 'interfaces/models/user';
import * as _ from 'lodash';
import { User } from 'models/user';
import * as tokenService from 'services/token';

import * as service from './auth';

describe('admin/services/auth', () => {
  let connection: Connection;

  const data = {
    email: 'admin@waproject.com.br',
    password: 'senha@123'
  };

  const userToken = {
    id: 1,
    email: 'test@email.com',
    firstName: 'test',
    lastName: 'test',
    roles: [] as enRoles[]
  };

  beforeAll(async () => connection = await connectAndMigrate());
  afterAll(() => connection.destroy());

  it('should return token for a valid user when try to login', async () => {
    const promise = service.login(data.email, data.password);

    await expect(promise).toResolve();
    const result = await promise;

    expect(result).toBeString();
  });

  it('should throw user-not-found when email is invalid when try to login', async () => {
    const promise = service.login('nothing@email.com', data.password);
    await expect(promise).toReject();

    const error: Error = await promise.catch(err => err);
    expect(error.message).toEqual('user-not-found');
  });

  it('should throw invalid-password when password is invalid when try to login', async () => {
    const promise = service.login(data.email, '123');
    await expect(promise).toReject();

    const error: Error = await promise.catch(err => err);
    expect(error.message).toEqual('invalid-password');
  });

  it('should throw invalid-password when password is invalid when try to change password', async () => {
    const promise = service.changePassword(userToken, '123', '456');
    await expect(promise).toReject();

    const error: Error = await promise.catch(err => err);
    expect(error.message).toEqual('invalid-password');
  });

  it('should return successfully when try to change password', async () => {
    return service.changePassword(userToken, data.password, '123456').then((user: User) => {
      return expect(user.checkPassword('123456')).toResolve();
    });
  });

  it('should return successfully when try to send reset password email', async () => {
    return expect(service.sendResetPassword(data.email)).toResolve();
  });

  it('should throw user-not-found when when try to send reset password email and email is invalid', async () => {
    const promise = service.sendResetPassword('invalid');
    await expect(promise).toReject();
    const error: Error = await promise.catch(err => err);

    expect(error.message).toEqual('user-not-found');
  });

  it('should return successfully when try to reset password', async () => {
    const newPassword = 'senha@123';

    const promiseToken = tokenService.resetPassword(userToken);
    await expect(promiseToken).toResolve();
    const token = await promiseToken;

    expect(token).toBeString();

    const promise = service.resetPassword(token, newPassword);
    await expect(promise).toResolve();
    const user = await promise;

    expect(user).toBeInstanceOf(User);
    expect(user.checkPassword(newPassword)).toResolve();
  });

  it('should throw user-not-found when try to reset password and userId is invalid', async () => {
    const newPassword = 'senha@123';
    const model = _.cloneDeep(userToken);
    model.id = 0;

    const promiseToken = tokenService.resetPassword(model);
    await expect(promiseToken).toResolve();
    const token = await promiseToken;

    expect(token).toBeString();
    const promise = service.resetPassword(token, newPassword);
    await expect(promise).toReject();

    const error: Error = await promise.catch(err => err);
    expect(error.message).toEqual('user-not-found');
  });

  it('should throw token-type-not-match when try to reset password and token is invalid', async () => {
    const newPassword = 'senha@123';

    const promiseToken = tokenService.userToken(userToken);
    await expect(promiseToken).toResolve();
    const token = await promiseToken;

    const promise = service.resetPassword(token, newPassword);
    await expect(promise).toReject();

    const error: Error = await promise.catch(err => err);
    expect(error.message).toEqual('token-type-not-match');
  });

  it('should throw token-invalid when try to reset password and token is invalid', async () => {
    const newPassword = 'senha@123';
    const promise = service.resetPassword('token', newPassword);
    await expect(promise).toReject();
    const error: Error = await promise.catch(err => err);

    expect(error.message).toEqual('token-invalid');
  });
});