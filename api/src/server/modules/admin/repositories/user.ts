import { enRoles, IUser } from 'interfaces/models/user';
import { IUserSocial } from 'interfaces/models/userSocial';
import { IPaginationParams } from 'interfaces/pagination';
import { User } from 'models/user';
import { UserSocial } from 'models/userSocial';
import { Page, Transaction } from 'objection';

export async function list(params: IPaginationParams, transaction?: Transaction): Promise<Page<User>> {
  let query = User
    .query(transaction)
    .select('*')
    .whereNot('roles', 'like', enRoles.sysAdmin)
    .page(params.page, params.pageSize);

  if (params.orderBy) {
    if (params.orderBy !== 'fullName') {
      query = query.orderBy(params.orderBy, params.orderDirection);
    } else {
      query = query
        .orderBy('firstName', params.orderDirection)
        .orderBy('lastName', params.orderDirection);
    }
  }

  if (params.term) {
    query = query.where(query => {
      return query
        .where('firstName', 'ilike', `%${params.term}%`)
        .orWhere('lastName', 'ilike', `%${params.term}%`)
        .orWhere('email', 'ilike', `%${params.term}%`);
    });
  }

  return await query;
}

export async function count(transaction?: Transaction): Promise<Number> {
  const result: any = await User.query(transaction)
    .count('id as count')
    .first();

  return Number(result.count);
}

export async function isEmailAvailable(email: string, skipUserId?: number, transaction?: Transaction): Promise<boolean> {
  let query = User.query(transaction).count('id as count').where({ email }).first();

  if (skipUserId) {
    query = query.where('id', '!=', skipUserId);
  }

  const result: any = await query;
  return Number(result.count) === 0;
}

export async function findById(id: number, transaction?: Transaction): Promise<User> {
  return await User.query(transaction).where({ id }).first();
}

export async function findByEmail(email: string, transaction?: Transaction): Promise<User> {
  return await User.query(transaction).where({ email }).first();
}

export async function findBySocial(socialId: string, type: string): Promise<User> {
  return await User.query()
    .eager('[socials]')
    .select('User.*')
    .join('UserSocial', 'UserSocial.userId', 'User.id')
    .where('UserSocial.ref', '=', socialId)
    .andWhere('UserSocial.provider', '=', type)
    .first();
}

export async function insert(model: IUser, transaction?: Transaction): Promise<User> {
  return await User.query(transaction).insert(model);
}

export async function update(model: IUser, transaction?: Transaction): Promise<User> {
  return await User.query(transaction).updateAndFetchById(model.id, <User>model);
}

export async function remove(id: number, transaction?: Transaction): Promise<void> {
  await User.query(transaction).del().where({ id });
}

export async function insertSocial(model: IUserSocial): Promise<UserSocial> {
  return UserSocial.query().insert(model).returning('*').first();
}

export async function updateSocial(model: IUserSocial): Promise<IUserSocial> {
  return await UserSocial.query()
    .patch(model)
    .where({ userId: model.userId, provider: model.provider })
    .then(() => model);
}