import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { type Request, type Response } from 'express';
import { randomUUID } from 'node:crypto';
import { GoogleService } from '../services/google.service';
import { ACCESS_COOKIE_OPTIONS } from '../constants/cookies';
import { CLIENT_URL } from 'src/config/environment';

@Controller('google')
export class GoogleController {
  constructor(private googleService: GoogleService) {}

  @Get('google')
  login(@Res() res: Response) {
    const state = randomUUID();
    res.cookie('oauth_state', state, {
      ...ACCESS_COOKIE_OPTIONS,
      maxAge: 1000 * 60 * 10,
    });
    const url = this.googleService.getRedirectUrl(state);
    return res.redirect(url);
  }

  @Get('google/callback')
  async callback(@Req() req: Request, @Res() res: Response) {
    try {
      const stateFromGoogle = req.query.state as string;
      const stateFromCookie = req.cookies['oauth_state'];

      if (!stateFromGoogle || stateFromGoogle !== stateFromCookie) {
        throw new UnauthorizedException('Invalid OAuth state');
      }
      const payload = await this.googleService.getPayload(
        req.query.code as string,
      );

      const { accessToken, refreshToken } =
        await this.googleService.loginGoogleUser(payload);
      res.cookie('accessToken', accessToken, {
        ...ACCESS_COOKIE_OPTIONS,
        maxAge: 1000 * 60 * 60 * 24,
      });

      res.cookie('refreshToken', refreshToken, {
        ...ACCESS_COOKIE_OPTIONS,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      return res.redirect(`${CLIENT_URL}/jobs`);
    } catch {
      return res.redirect(`${CLIENT_URL}/login?error=google_login_failed`);
    }
  }
}
