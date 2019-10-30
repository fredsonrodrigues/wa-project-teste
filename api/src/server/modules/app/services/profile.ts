import { ServiceError } from 'errors/service';
import { IUser } from 'interfaces/models/user';
import { IUserToken } from 'interfaces/tokens/user';
import * as lodash from 'lodash';
import { User } from 'models/user';

import * as userRepository from '../repositories/user';

export async function save(model: IUser, currentUser: IUserToken): Promise<User> {
  delete model.id;

  const user = await userRepository.findById(currentUser.id);
  if (!user) throw new ServiceError('not-found');

  lodash.merge(user, model);

  return await userRepository.update(user);
}