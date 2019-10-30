import { IUser } from 'interfaces/models/user';
import { IUserDevice } from 'interfaces/models/userDevice';
import { IUserSocial } from 'interfaces/models/userSocial';
import { User } from 'models/user';
import { UserDevice } from 'models/userDevice';
import { UserSocial } from 'models/userSocial';
import { Transaction } from 'objection';

export async function findById(id: number): Promise<User> {
  return await User.query()
    .eager('[socials, devices]')
    .where({ id })
    .first();
}

export async function findBySocial(socialId: string, provider: string, transaction: Transaction = null): Promise<User> {
  return await User.query(transaction)
    .eager('[socials]')
    .select('User.*')
    .join('UserSocial', 'UserSocial.userId', 'User.id')
    .where('UserSocial.ref', '=', socialId)
    .andWhere('UserSocial.provider', '=', provider)
    .first();
}

export async function findByEmail(email: string, transaction: Transaction = null): Promise<User> {
  return await User.query(transaction)
    .eager('[socials]')
    .where({ email })
    .first();
}

export async function insert(model: IUser, transaction: Transaction): Promise<User> {
  return await User.query(transaction).insert(<User>model);
}

export async function update(model: IUser, transaction: Transaction = null): Promise<User> {
  return await User.query(transaction).updateAndFetchById(model.id, <User>model);
}

export async function insertSocial(model: IUserSocial, transaction: Transaction = null): Promise<UserSocial> {
  return UserSocial.query(transaction).insert(model).returning('*').first();
}

export async function updateSocial(model: IUserSocial, transaction: Transaction = null): Promise<IUserSocial> {
  return await UserSocial.query(transaction)
    .patch(model)
    .where({ userId: model.userId, provider: model.provider })
    .then(() => model);
}

export async function byDevice(userId: number, deviceId: string, transaction: Transaction = null): Promise<User> {
  return await User.query(transaction)
    .select('User.*')
    .join('UserDevice', 'UserDevice.userId', 'User.id')
    .where('User.id', '=', userId)
    .andWhere('UserDevice.deviceId', '=', deviceId)
    .first();
}

export async function getDevice(userId: number, deviceId: string, transaction: Transaction = null): Promise<UserDevice> {
  return await UserDevice.query(transaction)
    .eager('user')
    .where({ userId, deviceId })
    .first();
}

export async function insertDevice(model: IUserDevice, transaction: Transaction = null): Promise<UserDevice> {
  return await UserDevice.query(transaction).insert(<UserDevice>model).returning('*').first();
}

export async function updateDevice(model: IUserDevice, transaction: Transaction = null): Promise<UserDevice> {
  return await UserDevice.query(transaction)
    .patch(<UserDevice>model)
    .where({ userId: model.userId, deviceId: model.deviceId })
    .then(() => <any>model);
}

export async function removeDevice(userId: number, deviceId: string, transaction: Transaction = null): Promise<void> {
  await UserDevice.query(transaction).delete().where({ userId, deviceId });
}