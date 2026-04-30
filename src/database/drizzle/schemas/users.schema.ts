import { timestamp } from 'drizzle-orm/pg-core';
import { boolean } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import { text } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const providerEnum = pgEnum('provider', ['LOCAL', 'GOOGLE', 'GITHUB']);

export const users = pgTable('Users', {
  id: uuid().defaultRandom().primaryKey(),
  firstName: text().notNull(),
  lastName: text().notNull(),
  email: text().notNull().unique(),
  provider: providerEnum().default('LOCAL').notNull(),
  password: text(),
  isDeleted: boolean().default(false),
  createdAt: timestamp({
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp({
    withTimezone: true,
  }),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
