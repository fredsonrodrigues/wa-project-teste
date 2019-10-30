import { ServiceError } from 'errors/service';
import { IUserSocial } from 'interfaces/models/userSocial';
import { ISocialUserInfo } from 'interfaces/socialUserInfo';
import { User } from 'models/user';
import { Transaction, transaction } from 'objection';

import * as userRepository from '../repositories/user';
import { generateTokens, ILoginDevice, ILoginResult } from './auth';

export async function login(socialUser: ISocialUserInfo, device: ILoginDevice): Promise<ILoginResult> {
  return await transaction(User.knex(), async transaction => {
    const user = await findUser(socialUser, transaction);
    if (!user) throw new ServiceError('user-not-found');

    return await generateTokens(user, device, transaction);
  });
}

async function findUser(socialUser: ISocialUserInfo, transaction: Transaction): Promise<User> {
  let user = await userRepository.findBySocial(socialUser.id, socialUser.provider, transaction);
  if (!user && !socialUser.email) return null;

  user = await userRepository.findByEmail(socialUser.email, transaction);
  if (!user) return null;

  await associateUserSocial(user, {
    userId: user.id,
    ref: socialUser.id,
    provider: socialUser.provider
  }, transaction);

  return user;
}

async function associateUserSocial(user: User, social: IUserSocial, transaction: Transaction): Promise<User> {
  let userSocial = user.socials.filter(s => s.provider === social.provider)[0];

  if (userSocial) {
    social = await userRepository.updateSocial(social, transaction);
    userSocial.ref = social.ref;
    return user;
  }

  social = await userRepository.insertSocial(social, transaction);
  user.socials.push(<any>social);

  return user;
}