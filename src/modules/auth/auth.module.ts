import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { GoogleService } from './services/google.service';
import { GoogleController } from './controllers/google.controller';

@Module({
  controllers: [AuthController, GoogleController],
  providers: [AuthService, GoogleService],
  imports: [UsersModule],
})
export class AuthModule {}
