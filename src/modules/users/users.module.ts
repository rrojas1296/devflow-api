import { Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { DrizzleModule } from 'src/database/drizzle/drizzle.module';

@Module({
  providers: [UsersRepository],
  exports: [UsersRepository],
  imports: [DrizzleModule],
})
export class UsersModule {}
