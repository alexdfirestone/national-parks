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
import { parks } from './parks';
import { categories } from './categories';
import { users } from './users';

export const thingStatusEnum = pgEnum('thing_status', [
  'published',
  'pending',
  'removed',
]);

export const things = pgTable(
  'things',
  {
    id: serial('id').primaryKey(),
    parkId: integer('park_id')
      .notNull()
      .references(() => parks.id, { onDelete: 'cascade' }),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
    authorId: integer('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    body: text('body').notNull(),
    status: thingStatusEnum('status').notNull().default('pending'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    parkIdIdx: index('things_park_id_idx').on(table.parkId),
    categoryParkIdx: index('things_category_park_idx').on(
      table.categoryId,
      table.parkId
    ),
    createdAtIdx: index('things_created_at_idx').on(table.createdAt.desc()),
    authorIdIdx: index('things_author_id_idx').on(table.authorId),
  })
);

export const thingImages = pgTable(
  'thing_images',
  {
    id: serial('id').primaryKey(),
    thingId: integer('thing_id')
      .notNull()
      .references(() => things.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    width: integer('width'),
    height: integer('height'),
    alt: text('alt'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    thingIdIdx: index('thing_images_thing_id_idx').on(table.thingId),
  })
);

// Relations
export const thingsRelations = relations(things, ({ one, many }) => ({
  park: one(parks, {
    fields: [things.parkId],
    references: [parks.id],
  }),
  category: one(categories, {
    fields: [things.categoryId],
    references: [categories.id],
  }),
  author: one(users, {
    fields: [things.authorId],
    references: [users.id],
  }),
  images: many(thingImages),
}));

export const thingImagesRelations = relations(thingImages, ({ one }) => ({
  thing: one(things, {
    fields: [thingImages.thingId],
    references: [things.id],
  }),
}));

export type Thing = typeof things.$inferSelect;
export type NewThing = typeof things.$inferInsert;
export type ThingImage = typeof thingImages.$inferSelect;
export type NewThingImage = typeof thingImages.$inferInsert;

