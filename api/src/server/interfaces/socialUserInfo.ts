export interface ISocialUserInfo {
  id: string;
  firstName: string;
  lastName?: string;
  avatar?: string;
  email?: string;
  provider: 'facebook' | 'google';
}