import * as sentry from '@sentry/node';
import { SENTRY_KEY, ENV, IS_DEV } from 'settings';

sentry.init({
  dsn: SENTRY_KEY,
  environment: ENV
});

export function exception(err: any): void {
  if (IS_DEV) {
    console.error(err);
  }

  sentry.captureException(err);
}