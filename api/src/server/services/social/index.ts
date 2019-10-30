import * as fs from 'fs';
import { ISocialUserInfo } from 'interfaces/socialUserInfo';
import * as request from 'request';
import * as uuid from 'uuid';

import * as facebookApi from './facebook';
import * as googleApi from './google';

export async function getUserInfo(provider: 'facebook' | 'google', accessToken: string): Promise<ISocialUserInfo> {
  const providers = { facebook, google };
  if (!providers[provider]) throw new Error('invalid-provider');

  const result = await providers[provider](accessToken);
  result.avatar = await downloadAvatar(result.avatar);

  return result;
}

async function facebook(accessToken: string): Promise<ISocialUserInfo> {
  try {
    return await facebookApi.getUserInfo(accessToken);
  } catch (err) {
    if (err.name === 'facebook-error' && err.full.code === 190) {
      err.name = 'invalid-social';
    }

    throw err;
  }
}

async function google(accessToken: string): Promise<ISocialUserInfo> {
  try {
    return await googleApi.getUserInfo(accessToken);
  } catch (err) {
    if (err.name === 'google-error' || err.message === 'google-no-reponse') {
      err.name = 'invalid-social';
    }

    throw err;
  }
}

async function downloadAvatar(url: string): Promise<string> {
  if (!url) return null;

  return new Promise<string>((resolve, reject) => {
    request(url)
      .on('response', res => {
        const contentType = <string>res.headers['content-type'];

        if (res.statusCode > 199 && res.statusCode < 300 && contentType.startsWith('image')) {
          const filePath = `/tmp/${uuid()}.${contentType.split('/').pop()}`;

          res.pipe(fs.createWriteStream(filePath))
            .on('finish', () => resolve(filePath))
            .on('error', err => reject(err));

          return;
        }

        resolve(null);
      })
      .on('error', err => reject(err));
  });
}