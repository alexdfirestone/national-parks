import {
  pgTable,
  serial,
  integer,
  smallint,
  timestamp,
  pgEnum,
  index,
  unique,
  check,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { users } from './users';

export const subjectTypeEnum = pgEnum('subject_type', ['thing', 'comment']);

export const votes = pgTable(
  'votes',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    subjectType: subjectTypeEnum('subject_type').notNull(),
    subjectId: integer('subject_id').notNull(),
    value: smallint('value').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    subjectIdx: index('votes_subject_idx').on(
      table.subjectType,
      table.subjectId
    ),
    // Unique constraint: one vote per user per subject
    userSubjectUnique: unique('votes_user_subject_unique').on(
      table.userId,
      table.subjectType,
      table.subjectId
    ),
    // Check constraint: value must be -1 or 1
    valueCheck: check(
      'votes_value_check',
      sql`${table.value} IN (-1, 1)`
    ),
  })
);

// Relations
export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
}));

export type Vote = typeof votes.$inferSelect;
export type NewVote = typeof votes.$inferInsert;

