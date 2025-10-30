import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { subjectTypeEnum } from './votes';

export const flagStatusEnum = pgEnum('flag_status', ['open', 'closed']);

export const moderationFlags = pgTable(
  'moderation_flags',
  {
    id: serial('id').primaryKey(),
    subjectType: subjectTypeEnum('subject_type').notNull(),
    subjectId: integer('subject_id').notNull(),
    reason: text('reason').notNull(),
    reporterId: integer('reporter_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    resolvedBy: integer('resolved_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    status: flagStatusEnum('status').notNull().default('open'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  },
  (table) => ({
    statusCreatedIdx: index('moderation_flags_status_created_idx').on(
      table.status,
      table.createdAt
    ),
    subjectIdx: index('moderation_flags_subject_idx').on(
      table.subjectType,
      table.subjectId
    ),
  })
);

// Relations
export const moderationFlagsRelations = relations(
  moderationFlags,
  ({ one }) => ({
    reporter: one(users, {
      fields: [moderationFlags.reporterId],
      references: [users.id],
      relationName: 'reported_flags',
    }),
    resolver: one(users, {
      fields: [moderationFlags.resolvedBy],
      references: [users.id],
      relationName: 'resolved_flags',
    }),
  })
);

export type ModerationFlag = typeof moderationFlags.$inferSelect;
export type NewModerationFlag = typeof moderationFlags.$inferInsert;

