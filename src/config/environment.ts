export const DATABASE_URL = process.env.DATABASE_URL || '';
export const JWT_SECRET = process.env.JWT_SECRET || '';
export const REFRESH_SECRET = process.env.REFRESH_SECRET || '';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
export const NODE_ENV =
  (process.env.NODE_ENV as 'production' | 'development') || 'development';
