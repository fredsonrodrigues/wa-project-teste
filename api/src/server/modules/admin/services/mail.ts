import { IUser } from 'interfaces/models/user';
import { IMail, send } from 'services/mail';
import * as urlService from 'services/url';

export async function sendUserCreate(user: IUser, password: string): Promise<IMail> {
  return await send(user.email, 'Bem Vindo!', 'user-create', {
    ...user,
    password
  });
}

export async function sendResetPassword(user: IUser, token: string): Promise<IMail> {
  return await send(user.email, 'Recuperar Acesso', 'user-reset-password', {
    ...user,
    url: urlService.resetPassword(token)
  });
}