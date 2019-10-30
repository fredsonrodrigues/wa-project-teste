/* eslint-disable camelcase */
import * as fb from 'fb';
import { ISocialUserInfo } from 'interfaces/socialUserInfo';
import * as urlService from 'services/url';
import * as settings from 'settings';

const fields = 'id,name,picture.type(large),email';

export async function getUserInfo(accessToken: string): Promise<ISocialUserInfo> {
  return new Promise<ISocialUserInfo>((resolve, reject) => {
    (<any>fb).setAccessToken(accessToken);

    fb.api(`/me?fields=${fields}`, (response: any) => {
      if (!response || response.error) return reject(apiError(response));

      const name = response.name.split(' ');
      resolve({
        id: response.id,
        firstName: name[0],
        lastName: name[1] || null,
        avatar: getAvatar(response),
        email: response.email,
        provider: 'facebook'
      });
    });
  });
}

export async function loginUrl(): Promise<string> {
  return (<any>fb).getLoginUrl({
    client_id: settings.FACEBOOK.appId,
    client_secret: settings.FACEBOOK.appSecret,
    redirect_uri: urlService.facebookCallback()
  });
}

export async function getAccessToken(code: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fb.api('oauth/access_token', {
      client_id: settings.FACEBOOK.appId,
      client_secret: settings.FACEBOOK.appSecret,
      redirect_uri: urlService.facebookCallback(),
      scope: settings.FACEBOOK.scopes.join(','),
      code
    }, (response: any) => {
      if (!response || response.error) return reject(apiError(response));
      resolve(response.access_token);
    });
  });
}

function getAvatar(response: any): string {
  if (!response.picture || !response.picture.data || response.picture.data.is_silhouette) {
    return null;
  }

  return response.picture.data.url;
}

function apiError(response: any): Error {
  if (!response) {
    return new Error('facebook-no-reponse');
  }

  const error = new Error(response.error.message);
  error.name = 'facebook-error';
  (<any>error).full = response.error;

  return error;
}