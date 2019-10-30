import { Sentry } from 'react-native-sentry';
import { ENV, IS_DEV, SENTRY_DSN } from '~/config';
import { IUserToken } from '~/interfaces/tokens/user';

export class LogService {
  constructor() {
    if (!IS_DEV) {
      Sentry.config(SENTRY_DSN).install();
    }

    Sentry.setTagsContext({
      environment: ENV,
      react: true
    });

    Sentry.setShouldSendCallback((err: any) => {
      if (!err) return false;

      if (typeof err === 'string') {
        err = new Error(err);
      }

      if (['NETWORK_ERROR'].includes(err.message)) {
        return false;
      }

      if (err.ignoreLog) {
        return false;
      }

      return true;
    });
  }

  public setUser(user: IUserToken): void {
    if (!user) {
      Sentry.setUserContext({
        id: null,
        email: null,
        username: null,
        extra: {}
      });
      return;
    }

    Sentry.setUserContext({
      id: user.id.toString(),
      email: user.email,
      username: user.email,
      extra: { ...user }
    });
  }

  public breadcrumb(message: string, category: string = 'manual', data: any = {}): void {
    console.log(category + ' ' + message);
    Sentry.captureBreadcrumb({ message, category, data });
  }

  public handleError(err: any): void {
    Sentry.captureException(err);
  }
}

const logService = new LogService();
export default logService;
