import { NavigationDispatch } from 'react-navigation';

export interface INotificationInfo<T = any> {
  action?: string;
  userId?: string;
  data?: T;
}

export interface INotificationHandler<T extends { [key: string]: string } = any> {
  (dispatch: NavigationDispatch, info: INotificationInfo<T>, appStarted: boolean): Promise<void>;
}
