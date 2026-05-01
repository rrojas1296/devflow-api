import { CookieOptions } from 'express';
import { NODE_ENV } from 'src/config/environment';

export const ACCESS_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};
