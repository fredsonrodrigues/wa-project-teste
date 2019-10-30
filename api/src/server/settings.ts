export const SITE_DNS = (process.env.DNS || '').trim().replace(/\/$/gi, '');
export const SENTRY_KEY = process.env.SENTRY_KEY;
export const PORT = process.env.NODE_PORT || 3000;
export const ENV = (process.env.NODE_ENV || 'development').trim();
export const BCRYPT_SALT_FACTOR = ENV === 'test' ? 4 : 11;

export const IS_PROD = ENV === 'production';
export const IS_DEV = ENV === 'development';
export const IS_TEST = ENV === 'test';

/* tslint:disable */
export const AUTH = {
  timeout: 480, // 8 hour
  appTimeout: 1440, // 24 hours
  resetPasswordTimeout: 1 * 60 * 24, //2 days
  secret: Buffer.from('RSd7w8utAWSjmJ8QOGt2OayydAQ3jKnDRMPDuwqaODObyyX0LS', 'base64').toString('utf8')
};
/* tslint:enable */

export const MAIL = {
  from: process.env.MAILGUN_FROM,
  credentials: {
    apiKey: process.env.MAILGUN_APIKEY,
    domain: process.env.MAILGUN_DOMAIN
  }
};

export const FACEBOOK = {
  appId: '231990960983128',
  appSecret: '4fb18fa3571fd8a0312d1c3a3861c904',
  scopes: ['email']
};

export const GOOGLE = {
  apiKey: 'AIzaSyB7r8ZMtM4s-WAvNT7z3mi2UB8W1LSogpk',
  clientId: '342330085837-hdpamasp70luntomk266nmd0irqui7jf.apps.googleusercontent.com',
  clientSecret: 'pv11mTH0_-tBQHuuhO9b0O46',
  scopes: [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ]
};

export const FIREBASE_KEY = process.env.FIREBASE_KEY;