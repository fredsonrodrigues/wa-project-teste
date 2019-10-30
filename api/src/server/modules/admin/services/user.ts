import { ServiceError } from 'errors/service';
import { enRoles, IUser, listPublicRoles } from 'interfaces/models/user';
import { IUserToken } from 'interfaces/tokens/user';
import { User } from 'models/user';

import * as userRepository from '../repositories/user';
import * as mail from './mail';

export async function save(model: IUser): Promise<User> {
  if (!model.roles || model.roles.length === 0) {
    throw new ServiceError('roles-required');
  }

  if (model.roles.includes(enRoles.sysAdmin)) {
    throw new ServiceError('not-allowed-to-change-sysAdmin');
  }

  if (!model.roles.every(r => listPublicRoles().includes(r))) {
    throw new ServiceError('invalid-roles');
  }

  if (model.id) return await update(model);
  return await create(model);
}

export async function remove(userId: number, currentUser: IUserToken): Promise<void> {
  const user = await userRepository.findById(userId);

  if (user.id === currentUser.id) {
    throw new ServiceError('not-allowed-remove-current-user');
  }

  if (user.isSysAdmin()) {
    throw new ServiceError('not-allowed-remove-sysAdmin');
  }

  return await userRepository.remove(userId);
}

async function create(model: IUser): Promise<User> {
  const isEmailAvailable = await userRepository.isEmailAvailable(model.email);
  if (!isEmailAvailable) throw new ServiceError('email-unavailable');

  const { password, hash } = await User.generatePassword();
  model.password = hash;

  const user = await userRepository.insert(model);
  await mail.sendUserCreate(user, password);

  return user;
}

async function update(model: IUser): Promise<User> {
  const isEmailAvailable = await userRepository.isEmailAvailable(model.email, model.id);
  if (!isEmailAvailable) throw new ServiceError('email-unavailable');

  const user = await userRepository.findById(model.id);

  if (!user) throw new ServiceError('not-found');
  if (user.isSysAdmin()) throw new ServiceError('not-allowed-to-change-sysAdmin');

  return await userRepository.update({ ...user, ...model } as User);
}