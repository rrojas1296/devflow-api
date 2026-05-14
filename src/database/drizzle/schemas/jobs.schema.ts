import { varchar } from 'drizzle-orm/pg-core';
import { boolean } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import { text } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const modalityEnum = pgEnum('modality', ['onsite', 'remote', 'hybrid']);

export type JobModality = 'onsite' | 'remote' | 'hybrid';

export const jobs = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title').notNull(),
  description: text('description').notNull(),
  companyName: text('company_name').notNull(),
  location: text('location').notNull(),
  stack: text('stack').array().notNull().default([]),
  isDeleted: boolean('isDeleted').notNull().default(false),
  imageUrl: text('image_url'),
  modality: modalityEnum('modality').notNull().default('remote'),
  linkUrl: text('link_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export type JobsCreateInput = typeof jobs.$inferInsert;
export type Job = typeof jobs.$inferSelect;
