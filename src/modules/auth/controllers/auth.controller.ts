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
import { RegisterUserDTO } from '../dtos/register-user.dto';
import { AuthService } from '../services/auth.service';
import { type Request, type Response } from 'express';
import { ACCESS_COOKIE_OPTIONS } from '../constants/cookies';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() body: LoginUserDTO, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.loginUser(body);

    res.cookie('accessToken', accessToken, {
      ...ACCESS_COOKIE_OPTIONS,
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie('refreshToken', refreshToken, {
      ...ACCESS_COOKIE_OPTIONS,
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
      ...ACCESS_COOKIE_OPTIONS,
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie('refreshToken', refreshToken, {
      ...ACCESS_COOKIE_OPTIONS,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.json({
      message: 'User registered successfully',
      statusCode: HttpStatus.OK,
    });
  }

  @Get('validate')
  async validateUser(@Res() res: Response, @Req() req: Request) {
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken || !refreshToken) {
      return res.json({
        isAuthenticated: false,
        message: 'Session not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    const payload = await this.authService.validateCookies(
      accessToken as string,
      refreshToken as string,
    );
    return res.json({
      isAuthenticated: !!payload,
      message: 'Session validated successfully',
      statusCode: HttpStatus.OK,
    });
  }
}
