import { JWT_SECRET, REFRESH_SECRET } from 'src/config/environment';
import * as jose from 'jose';
import { Payload } from 'src/modules/auth/interfaces/jwt.interface';

export const generateTokens = async (
  email: string,
  sub: string,
): Promise<{ accessToken: string; refreshToken: string }> => {
  const jwtSecret = new TextEncoder().encode(JWT_SECRET);
  const refreshSecret = new TextEncoder().encode(REFRESH_SECRET);

  const jwt = new jose.SignJWT({ email, sub });

  const accessToken = await jwt
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(jwtSecret);

  const refreshToken = await jwt
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(refreshSecret);

  return { accessToken, refreshToken };
};

export const verifyToken = async (
  token: string,
  type: 'access' | 'refresh',
) => {
  try {
    const secret =
      type === 'access'
        ? new TextEncoder().encode(JWT_SECRET)
        : new TextEncoder().encode(REFRESH_SECRET);
    const { payload } = await jose.jwtVerify<Payload>(token, secret);
    return payload;
  } catch {
    return null;
  }
};
