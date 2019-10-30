/* eslint-disable camelcase */
import { OAuth2Client } from 'google-auth-library';
import * as googleApi from 'googleapis';
import { ISocialUserInfo } from 'interfaces/socialUserInfo';
import * as urlService from 'services/url';
import * as settings from 'settings';

export async function getUserInfo(accessToken: string): Promise<ISocialUserInfo> {
  return new Promise<ISocialUserInfo>((resolve, reject) => {
    const plus = new googleApi.plus_v1.Plus({});
    const oauth2Client = getOAuth2Client(accessToken);

    plus.people.get({
      userId: 'me',
      auth: oauth2Client
    }, (err: Error, response: any) => {
      if (err || !response || response.error) {
        reject(apiError(err || response));
        return;
      }

      const data = response.data;

      resolve({
        id: data.id,
        firstName: data.name.givenName,
        lastName: data.name.familyName,
        avatar: getAvatar(data),
        email: data.emails ? data.emails[0].value : null,
        provider: 'google'
      });
    });
  });
}

export async function loginUrl(): Promise<string> {
  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: settings.GOOGLE.scopes
  });
}

export async function getAccessToken(code: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const oauth2Client = getOAuth2Client();
    oauth2Client.getToken(code, (error: Error, tokens: any) => {
      if (error) return reject(apiError({ error }));
      resolve(tokens.access_token);
    });
  });
}

function getAvatar(data: any): string {
  if (!data.image || !data.image.url || data.image.isDefault) return null;
  if (data.image.url === 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=200') return null;
  return data.image.url.replace('?sz=50', '?sz=200');
}

function apiError(response: any): Error {
  if (!response) {
    return new Error('google-no-reponse');
  }

  const error = new Error(response.error.message);
  error.name = 'google-error';
  (<any>error).full = response.error;

  return error;
}

function getOAuth2Client(accessToken: string = null): OAuth2Client {
  const oauth2Client = new OAuth2Client(
    settings.GOOGLE.clientId,
    settings.GOOGLE.clientSecret,
    urlService.googleCallback()
  );

  if (accessToken) {
    oauth2Client.credentials.access_token = accessToken;
  }

  return oauth2Client;
}