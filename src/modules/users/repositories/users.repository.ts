import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { InsertUser, User, users } from 'src/database/drizzle/schemas';
import { type DB } from 'src/database/drizzle/types/drizzle';

@Injectable()
export class UsersRepository {
  constructor(@Inject('DRIZZLE') private readonly db: DB) {}

  async get(): Promise<(User | null)[]> {
    return this.db.select().from(users);
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user[0];
  }

  async create(data: InsertUser): Promise<User> {
    const user = await this.db.insert(users).values(data).returning();
    return user[0];
  }
}
