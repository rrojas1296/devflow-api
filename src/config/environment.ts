export const DATABASE_URL = process.env.DATABASE_URL || '';
export const JWT_SECRET = process.env.JWT_SECRET || '';
export const REFRESH_SECRET = process.env.REFRESH_SECRET || '';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || '';
export const NODE_ENV =
  (process.env.NODE_ENV as 'production' | 'development') || 'development';

if (NODE_ENV !== 'production') {
  console.log({
    DATABASE_URL,
    JWT_SECRET,
    REFRESH_SECRET,
    CLIENT_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
    NODE_ENV,
  });
}
