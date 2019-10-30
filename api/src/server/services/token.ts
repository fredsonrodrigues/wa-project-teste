import { ServiceError } from 'errors/service';
import { IUser } from 'interfaces/models/user';
import { IRefreshToken } from 'interfaces/tokens/refreshToken';
import { IResetPasswordToken } from 'interfaces/tokens/resetPassword';
import { IUserToken } from 'interfaces/tokens/user';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import { AUTH } from 'settings';

export enum enTokenType {
  userToken = 0,
  resetPassword = 1,
  refreshToken = 2
}

export async function userToken(user: IUser, forApp: boolean = false): Promise<string> {
  const tokenData: IUserToken = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: user.roles,
  };

  return await sign(tokenData, enTokenType.userToken, forApp ? AUTH.appTimeout : AUTH.timeout);
}

export async function refreshToken(userId: number, deviceId: string, uuid: string): Promise<string> {
  const tokenData: IRefreshToken = { userId, deviceId, uuid };
  return await sign(tokenData, enTokenType.refreshToken);
}

export async function renewUserToken(userToken: IUserToken): Promise<string> {
  userToken = _.cloneDeep(userToken);
  return await sign(userToken, enTokenType.userToken, AUTH.timeout);
}

export async function resetPassword(user: IUser): Promise<string> {
  const tokenData: IResetPasswordToken = {
    id: user.id,
    firstName: user.firstName,
    email: user.email
  };

  return await sign(tokenData, enTokenType.resetPassword, AUTH.resetPasswordTimeout);
}

export async function verify<T>(token: string, type: enTokenType): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    jwt.verify(token, AUTH.secret, (err: any, decoded: any) => {
      if (err || !decoded || decoded.type !== type) {
        return reject(resolveVerifyError(err));
      }

      resolve(decoded);
    });
  });
}

async function sign(tokenData: any, type: enTokenType, expiration: number = null): Promise<string> {
  return new Promise<string>((resolve) => {
    (<any>tokenData).type = type;

    if (expiration) {
      (<any>tokenData).exp = expirationDate(expiration);
    }

    resolve(jwt.sign(tokenData, AUTH.secret));
  });
}

function expirationDate(minutes: number): number {
  return Math.floor(Date.now() / 1000) + (minutes * 60);
}

function resolveVerifyError(err: Error): Error {
  if (!err) {
    return new ServiceError('token-type-not-match');
  }

  switch (err.name) {
    case 'TokenExpiredError':
      return new ServiceError('token-expired');
    default:
      return new ServiceError('token-invalid');
  }

}