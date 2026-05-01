import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import {
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from 'src/config/environment';
import { GooglePayload } from '../interfaces/google-payload.interface';
import { LoginGoogleDTO } from '../dtos/login-google.dto';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { generateTokens } from 'src/common/utils/jwt';
import { type Response } from 'express';
import { ACCESS_COOKIE_OPTIONS } from '../constants/cookies';

@Injectable()
export class GoogleService {
  constructor(private usersRepository: UsersRepository) {}
  private clientOauth2 = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
  );

  async getPayload(code: string) {
    const { tokens } = await this.clientOauth2.getToken(code);
    if (!tokens.id_token)
      throw new UnauthorizedException('Invalid Google authentication');
    const ticket = await this.clientOauth2.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload)
      throw new UnauthorizedException('Invalid Google authentication');
    return {
      idGoogle: payload.sub,
      email: payload.email || '',
      firstName: payload.given_name || '',
      lastName: payload.family_name || '',
      picture: payload.picture || '',
    } as GooglePayload;
  }

  getRedirectUrl(state: string) {
    const url = this.clientOauth2.generateAuthUrl({
      scope: ['profile', 'email', 'openid'],
      prompt: 'consent',
      state,
    });
    return url;
  }

  async loginGoogleUser({
    email,
    firstName,
    lastName,
    picture,
    idGoogle,
  }: LoginGoogleDTO) {
    const user = await this.usersRepository.getByEmail(email);
    if (user) {
      const { accessToken, refreshToken } = await generateTokens(
        user.email,
        user.id,
      );
      return { accessToken, refreshToken };
    } else {
      const newUser = await this.usersRepository.create({
        email,
        firstName,
        idGoogle,
        lastName,
        provider: 'GOOGLE',
        imageUrl: picture,
      });
      const { accessToken, refreshToken } = await generateTokens(
        newUser.email,
        newUser.id,
      );
      return { accessToken, refreshToken };
    }
  }

  logoutUser(@Res() res: Response) {
    res.clearCookie('accessToken', ACCESS_COOKIE_OPTIONS);
    res.clearCookie('refreshToken', ACCESS_COOKIE_OPTIONS);
    return {
      message: 'User logged out successfully',
      statusCode: 200,
    };
  }
}
