import { Injectable } from '@nestjs/common';
import { Users } from 'generated/prisma/client';
import { UsersCreateInput } from 'generated/prisma/models';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private prismaService: PrismaService) {}

  async get(): Promise<Users[]> {
    const users = await this.prismaService.users.findMany();
    return users;
  }

  async getByEmail(email: string): Promise<Users | null> {
    const user = await this.prismaService.users.findUnique({
      where: { email },
    });
    return user;
  }

  async create(data: UsersCreateInput): Promise<string> {
    const user = await this.prismaService.users.create({ data });
    return user.id;
  }
}
