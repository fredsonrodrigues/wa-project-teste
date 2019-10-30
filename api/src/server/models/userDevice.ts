import { IUserDevice } from 'interfaces/models/userDevice';
import { Model } from 'objection';

import { User } from './user';

export class UserDevice extends Model implements IUserDevice {
  public deviceId: string;
  public userId: number;
  public name: string;
  public currentToken: string;
  public notificationToken?: string;

  public user: User;

  public static get tableName(): string {
    return 'UserDevice';
  }

  public static get relationMappings(): any {
    return {

      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        filter: (query: any) => query.select('id', 'firstName', 'lastName', 'email'),
        join: {
          from: 'User.id',
          to: 'UserDevice.userId'
        }
      }

    };
  }

  public $formatJson(data: IUserDevice): IUserDevice {
    delete data.notificationToken;
    delete data.currentToken;
    return data;
  }
}