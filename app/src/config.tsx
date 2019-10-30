import { Platform } from 'react-native';

export const ENV = __DEV__ ? 'development' : 'production';
export const IS_DEV = ENV === 'development';

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';

export const SENTRY_DSN = '';

export const API_ENDPOINT =
  ENV === 'production' ? 'https://app.icbsorocaba.com.br/api/app' : 'https://app.icbsorocaba.com.br/api/app';
// 'http://192.168.15.149:3001/api/app';
// 'http://10.10.60.79:3001/api/app';

export const GOOGLE_API = {
  iosClientId: '342330085837-8ginc71452df625cqoctimng6gld6aov.apps.googleusercontent.com',
  webClientId: '342330085837-hdpamasp70luntomk266nmd0irqui7jf.apps.googleusercontent.com'
};
