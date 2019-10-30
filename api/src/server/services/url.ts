import { SITE_DNS } from 'settings';

export function home(): string {
  return SITE_DNS;
}

export function content(content: string): string {
  return `${SITE_DNS}/api/content/${content}`;
}

export function resetPassword(token: string): string {
  return `${SITE_DNS}/nova-senha?t=${token}`;
}

export function loginSocial(token: string): string {
  return `${SITE_DNS}/social-callback?t=${token}`;
}

export function loginMessage(message: string): string {
  return `${SITE_DNS}/social-callback?m=${message}`;
}

export function facebookCallback(): string {
  return `${SITE_DNS}/api/admin/auth/facebook/callback`;
}

export function googleCallback(): string {
  return `${SITE_DNS}/api/admin/auth/google/callback`;
}