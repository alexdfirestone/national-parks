import { pgTable, serial, text, numeric, timestamp, index } from 'drizzle-orm/pg-core';

export const parks = pgTable(
  'parks',
  {
    id: serial('id').primaryKey(),
    cmsId: text('cms_id').notNull().unique(), // Sanity _id
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    states: text('states').array(),
    summary: text('summary'),
    heroUrl: text('hero_url'),
    lat: numeric('lat'),
    lng: numeric('lng'),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    cmsIdIdx: index('parks_cms_id_idx').on(table.cmsId),
    slugIdx: index('parks_slug_idx').on(table.slug),
  })
);

export type Park = typeof parks.$inferSelect;
export type NewPark = typeof parks.$inferInsert;

