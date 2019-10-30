import { ServiceError } from 'errors/service';
import { IUserDevice } from 'interfaces/models/userDevice';
import { IRefreshToken } from 'interfaces/tokens/refreshToken';
import { IUserToken } from 'interfaces/tokens/user';
import { User } from 'models/user';
import { UserDevice } from 'models/userDevice';
import { Transaction } from 'objection';
import * as tokenService from 'services/token';
import * as uuidGenerator from 'uuid';

import * as userRepository from '../repositories/user';

export interface ILoginResult {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginDevice {
  deviceId: string;
  deviceName: string;
  notificationToken?: string;
}

export interface ILoginParams extends ILoginDevice {
  email: string;
  password: string;

}

export async function login(model: ILoginParams): Promise<ILoginResult> {
  const user = await userRepository.findByEmail(model.email);
  if (!user) throw new ServiceError('user-not-found');

  const isValid = await user.checkPassword(model.password);
  if (!isValid) throw new ServiceError('invalid-password');

  return await generateTokens(user, model);
}

export async function generateTokens(user: User, device: ILoginDevice, transaction: Transaction = null): Promise<ILoginResult> {
  if (!user) throw new Error('user-not-found');

  const token = uuidGenerator();
  const [accessToken, refreshToken] = await Promise.all([
    tokenService.userToken(user, true),
    tokenService.refreshToken(user.id, device.deviceId, token)
  ]);

  await saveDevice({
    deviceId: device.deviceId,
    name: device.deviceName,
    notificationToken: device.notificationToken,
    currentToken: token,
    userId: user.id,
  }, transaction);

  return { accessToken, refreshToken };
}

export async function generateAccessToken(refreshToken: string): Promise<string> {
  const token = await tokenService.verify<IRefreshToken>(refreshToken, tokenService.enTokenType.refreshToken);
  const device = await userRepository.getDevice(token.userId, token.deviceId);

  if (!device) throw new ServiceError('device-not-found');
  if (device.currentToken !== token.uuid) throw new ServiceError('token-changed');

  return await tokenService.userToken(device.user, true);
}

export async function logout(user: IUserToken, deviceId: string): Promise<void> {
  await userRepository.removeDevice(user.id, deviceId);
}

async function saveDevice(model: IUserDevice, transaction: Transaction = null): Promise<UserDevice> {
  const device = await userRepository.getDevice(model.userId, model.deviceId, transaction);

  if (device) {
    return await userRepository.updateDevice(model, transaction);
  }

  return await userRepository.insertDevice(model, transaction);
}