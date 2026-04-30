import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { LoginUserDTO } from '../dtos/login-user.dto';
import arctic from 'arctic';
import { RegisterUserDTO } from '../dtos/register-user.dto';
import { AuthService } from '../auth.service';
import { type Request, type Response } from 'express';
import { NODE_ENV } from 'src/config/environment';
import { google } from '../clients/google';

// 🔥 simple in-memory store (usa Redis en prod)
const store = new Map<string, string>();

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() body: LoginUserDTO, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.loginUser(body);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.json({
      message: 'User logged in successfully',
      statusCode: HttpStatus.OK,
    });
  }

  @Post('register')
  async registerUser(@Body() body: RegisterUserDTO, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.registerUser(body);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return res.json({
      message: 'User registered successfully',
      statusCode: HttpStatus.OK,
    });
  }

  @Get('validate')
  async validateUser(@Res() res: Response, @Req() req: Request) {
    const { accessToken, refreshToken } = req.cookies;
    const payload = await this.authService.validateCookies(
      accessToken as string,
      refreshToken as string,
    );
    return res.json({
      isAuthenticated: payload ? true : false,
      message: 'User logged in successfully',
      statusCode: HttpStatus.OK,
    });
  }

  // 1. REDIRECT A GOOGLE
  @Get('google')
  login(@Res() res: Response) {
    const state = arctic.generateState();

    const codeVerifier = arctic.generateCodeVerifier();
    console.log({ codeVerifier });
    const scopes = ['openid', 'email', 'profile'];
    const url = google.createAuthorizationURL(state, codeVerifier, scopes);

    store.set(state, codeVerifier);
    return res.redirect(url.toString());
  }

  // 2. GET CODE
  @Get('google/callback')
  async callback(@Req() req: Request) {
    const code = req.query.code as string;
    const state = req.query.state as string;

    if (!code || !state) {
      throw new Error('Missing code or state');
    }

    // 🔥 recuperar code_verifier desde storage
    const codeVerifier = store.get(state);

    if (!codeVerifier) {
      throw new Error('Invalid or expired state (code_verifier missing)');
    }

    // 🔥 intercambio correcto con Arctic
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);

    const idToken = tokens.idToken();

    const payload = JSON.parse(
      Buffer.from(idToken.split('.')[1], 'base64').toString(),
    );

    console.log({ payload });

    return JSON.stringify(payload);
  }
}
