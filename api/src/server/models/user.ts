import { enRoles, IUser } from 'interfaces/models/user';
import { Model } from 'objection';
import * as generatePassword from 'password-generator';
import * as bcrypt from 'services/bcrypt';

import { UserDevice } from './userDevice';
import { UserSocial } from './userSocial';

export class User extends Model implements IUser {
  public id: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public roles: enRoles[];

  public createdDate: Date;
  public updatedDate: Date;

  public devices?: UserDevice[];
  public socials?: UserSocial[];

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  public static get tableName(): string {
    return 'User';
  }

  public static get relationMappings(): any {
    return {
      devices: {
        relation: Model.HasManyRelation,
        modelClass: UserDevice,
        join: {
          from: 'User.id',
          to: 'UserDevice.userId'
        }
      },

      socials: {
        relation: Model.HasManyRelation,
        modelClass: UserSocial,
        join: {
          from: 'User.id',
          to: 'UserSocial.userId'
        }
      }
    };
  }

  public static get virtualAttributes(): string[] {
    return ['fullName'];
  }

  public static generatePassword(): Promise<{ password: string, hash: string }> {
    const password = generatePassword(6);
    return bcrypt.hash(password).then(hash => {
      return { password, hash };
    });
  }

  public setPassword(password: string): Promise<void> {
    return bcrypt.hash(password).then(hash => {
      this.password = hash;
    });
  }

  public checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(this.password, password);
  }

  public isSysAdmin(): boolean {
    return this.roles.includes(enRoles.sysAdmin);
  }

  public $beforeInsert(): void {
    this.createdDate = this.updatedDate = new Date();
  }

  public $beforeUpdate(): void {
    this.updatedDate = new Date();
  }

  public $formatDatabaseJson(json: any): any {
    json = Model.prototype.$formatDatabaseJson.call(this, json);
    json.roles = json.roles && json.roles.length ? json.roles.join(',') : null;
    return json;
  }

  public $parseDatabaseJson(json: any): any {
    json.roles = json.roles ? json.roles.split(',') : [];
    json.createdDate = json.createdDate ? new Date(json.createdDate) : null;
    json.updatedDate = json.updatedDate ? new Date(json.updatedDate) : null;
    return Model.prototype.$formatDatabaseJson.call(this, json);
  }

  public $formatJson(data: IUser): IUser {
    delete data.password;
    return data;
  }
}