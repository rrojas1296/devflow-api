import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgEnum } from 'drizzle-orm/pg-core';
import { uuid, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const providerEnum = pgEnum('provider', ['GOOGLE', 'GITHUB', 'LOCAL']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: text('firstName').notNull(),
  lastName: text('lastName').notNull(),
  email: text('email').notNull(),
  imageUrl: text('imageUrl'),
  password: text('password'),
  provider: providerEnum('provider').default('LOCAL').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp('deletedAt', { withTimezone: true }),
});

export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;
