import * as joi from 'joi';

import * as service from './auth';
import { connectAndMigrate, Connection } from 'db';

describe('app/services/auth', () => {
  let connection: Connection;

  const login = {
    email: 'admin@waproject.com.br',
    password: 'senha@123',
    deviceId: '1',
    deviceName: 'test-console'
  };

  beforeAll(async () => connection = await connectAndMigrate());
  afterAll(() => connection.destroy());

  it('should return token for a valid user when try to login', async () => {
    const promise = service.login(login);
    expect(promise).toResolve();

    const token = await promise;
    expect(token.accessToken).toBeString();
    expect(token.refreshToken).toBeString();
  });

  it('should throw user-not-found when email is invalid when try to login', async () => {
    const promise = service.login({ ...login, email: 'nothing@email.com' });
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.message).toEqual('user-not-found');
  });

  it('should throw invalid-password when password is invalid when try to login', async () => {
    const promise = service.login({ ...login, password: 'invalid' });
    await expect(promise).toReject();

    const err: joi.CustomValidationError = await promise.catch(err => err);
    expect(err.message).toEqual('invalid-password');
  });

  it('should update divice and return tokens', async () => {
    const promise = service.login(login);
    expect(promise).toResolve();

    const tokens = await promise;
    expect(tokens.accessToken).not.toBeEmpty();
    expect(tokens.refreshToken).not.toBeEmpty();
  });

  it('should generate a new access token', async () => {
    const loginPromise = service.login(login);
    expect(loginPromise).toResolve();
    const tokens = await loginPromise;

    const tokenPromise = service.generateAccessToken(tokens.refreshToken);
    expect(tokenPromise).toResolve();
    const accessToken = await tokenPromise;

    expect(accessToken).not.toBeEmpty();
  });

});