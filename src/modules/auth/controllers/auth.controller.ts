import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { LoginUserDTO } from '../dtos/LoginUser.dto';
import { AuthService } from '../services/auth.service';
import { RegisterUserDTO } from '../dtos/RegisterUser.dto';
import { type Request, type Response } from 'express';
import { NODE_ENV } from 'src/config/environment';

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
}
