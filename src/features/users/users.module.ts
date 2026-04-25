import { Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { PrismaModule } from 'src/database/prisma/prisma.module';

@Module({
  providers: [UsersRepository],
  exports: [UsersRepository],
  imports: [PrismaModule],
})
export class UsersModule {}
