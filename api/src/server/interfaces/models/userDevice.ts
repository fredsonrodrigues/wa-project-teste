import { IUser } from './user';

export interface IUserDevice {
  deviceId: string;
  userId: number;
  name: string;
  currentToken: string;
  notificationToken?: string;

  user?: IUser;
}