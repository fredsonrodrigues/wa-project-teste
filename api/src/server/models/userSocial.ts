import { Model } from 'objection';

import { IUserSocial } from '../interfaces/models/userSocial';
import { User } from './user';

export class UserSocial extends Model implements IUserSocial {
  public userId: number;
  public ref: string;
  public provider: string;

  public user: User;

  public static get tableName(): string {
    return 'UserSocial';
  }

  public static get relationMappings(): any {
    return {

      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        filter: (query: any) => query.select('id', 'firstName', 'lastName', 'email'),
        join: {
          from: 'UserSocial.userId',
          to: 'User.id'
        }
      }

    };
  }

}