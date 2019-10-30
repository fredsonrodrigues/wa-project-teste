import { IUserToken } from 'interfaces/tokens/user';

import * as userRepository from '../repositories/user';

export async function register(notificationToken: string, deviceId: string, user: IUserToken): Promise<void> {
  const device = await userRepository.getDevice(user.id, deviceId);
  if (!device) return;

  device.notificationToken = notificationToken;
  await userRepository.updateDevice(device);
}