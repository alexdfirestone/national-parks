import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  index,
  check,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { things } from './things';
import { users } from './users';

export const comments = pgTable(
  'comments',
  {
    id: serial('id').primaryKey(),
    thingId: integer('thing_id')
      .notNull()
      .references(() => things.id, { onDelete: 'cascade' }),
    authorId: integer('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    parentId: integer('parent_id').references((): any => comments.id, {
      onDelete: 'cascade',
    }),
    body: text('body').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    thingCreatedIdx: index('comments_thing_created_idx').on(
      table.thingId,
      table.createdAt
    ),
    parentIdIdx: index('comments_parent_id_idx').on(table.parentId),
    // NOTE: One-level replies must be enforced at application level
    // PostgreSQL CHECK constraints cannot use subqueries
  })
);

// Relations
export const commentsRelations = relations(comments, ({ one, many }) => ({
  thing: one(things, {
    fields: [comments.thingId],
    references: [things.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'comment_replies',
  }),
  replies: many(comments, {
    relationName: 'comment_replies',
  }),
}));

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

