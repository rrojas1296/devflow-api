import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { sleep } from 'src/common/utils/sleep';
import { comparePassword, hashPassword } from 'src/common/utils/bcrypt';
import { generateTokens, verifyToken } from 'src/common/utils/jwt';
import { LoginUserDTO } from './dtos/login-user.dto';
import { RegisterUserDTO } from './dtos/register-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository) {}
  async loginUser(data: LoginUserDTO) {
    const user = await this.usersRepository.getByEmail(data.email);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const isValidPassword = await comparePassword(
      data.password,
      user.password ? user.password : '',
    );
    if (!isValidPassword) throw new HttpException('Invalid password', 401);

    await sleep(2000);

    const { accessToken, refreshToken } = await generateTokens(
      user.email,
      user.id,
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async registerUser(data: RegisterUserDTO) {
    const user = await this.usersRepository.getByEmail(data.email);
    if (user) throw new HttpException('User already exists', 400);
    const hash = await hashPassword(data.password);
    const newUser = await this.usersRepository.create({
      ...data,
      password: hash,
    });

    const { accessToken, refreshToken } = await generateTokens(
      newUser.email,
      newUser.id,
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateCookies(accessToken: string, refreshToken: string) {
    const payload = await verifyToken(accessToken, 'access');
    await verifyToken(refreshToken, 'refresh');
    return payload;
  }
}
