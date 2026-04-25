import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDTO } from '../dtos/LoginUser.dto';
import { UsersRepository } from 'src/features/users/repositories/users.repository';
import { RegisterUserDTO } from '../dtos/RegisterUser.dto';
import { comparePassword, hashPassword } from '../utils/bcrypt';
import { generateTokens, verifyToken } from '../utils/jwt';
import { sleep } from '../utils/sleep';

@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository) {}
  async loginUser(data: LoginUserDTO) {
    const user = await this.usersRepository.getByEmail(data.email);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const isValidPassword = await comparePassword(data.password, user.password);
    if (!isValidPassword) throw new HttpException('Invalid password', 401);

    await sleep(2000);

    const { accessToken, refreshToken } = await generateTokens({
      email: user.email,
      sub: user.id,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async registerUser(data: RegisterUserDTO) {
    const user = await this.usersRepository.getByEmail(data.email);
    if (user) throw new HttpException('User already exists', 400);
    const password = await hashPassword(data.password);
    const id = await this.usersRepository.create({
      ...data,
      password,
    });

    const { accessToken, refreshToken } = await generateTokens({
      email: data.email,
      sub: id,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateCookies(accessToken: string, refreshToken: string) {
    try {
      const payload = await verifyToken(accessToken, 'access');
      await verifyToken(refreshToken, 'refresh');
      return payload;
    } catch {
      throw new HttpException('Invalid token', 401);
    }
  }
}
