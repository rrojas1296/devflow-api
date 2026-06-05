import { varchar } from 'drizzle-orm/pg-core';
import { boolean } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import { text } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { companies } from './companies.schema';
import { relations } from 'drizzle-orm';

export const modalityEnum = pgEnum('modality', ['onsite', 'remote', 'hybrid']);

export type JobModality = 'onsite' | 'remote' | 'hybrid';

export const jobs = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  stack: text('stack').array().notNull().default([]),
  isDeleted: boolean('is_deleted').notNull().default(false),
  modality: modalityEnum('modality').notNull().default('remote'),
  externalId: varchar('external_id').unique().notNull(),
  postedDate: timestamp('posted_date', { withTimezone: true }).notNull(),
  source: text('source').notNull(),
  linkUrl: text('link_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id),
});

export const jobsRelations = relations(jobs, ({ one }) => ({
  company: one(companies, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
}));
