export const environments = {
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  PORT: process.env.PORT || '8000',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
};
