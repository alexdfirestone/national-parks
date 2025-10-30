# Database Setup Guide

This document describes the PostgreSQL database schema and setup for the National Parks application.

## Overview

The database uses **Drizzle ORM** with **Neon Serverless Postgres** to manage user-generated content including:
- User accounts (OAuth-based)
- Parks mirror (cached Sanity CMS data)
- Categories for content
- Things (user posts about parks)
- Comments with one-level replies
- Polymorphic votes (on things and comments)
- Moderation flags

## Setup Instructions

### 1. Create a Neon Database

1. Go to [neon.tech](https://neon.tech) and create a new project
2. Copy your database connection string

### 2. Configure Environment Variables

Create a `.env.local` file in the project root (see `ENV_SETUP.md` for full template):

```bash
# Database (server-side only)
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

**Note:** Your Sanity environment variables should already be configured. You only need to add `DATABASE_URL`.

### 3. Apply the Schema

You have three options:

#### Option A: Push schema directly (Quickest for development)
```bash
pnpm db:push
```

#### Option B: Run the generated migration (Best for production)
```bash
pnpm db:migrate
```

#### Option C: Execute raw SQL in Neon SQL Editor
Copy the contents of `sql/schema.sql` and paste it into the Neon SQL Editor.

## Database Schema

### Tables

#### users
User accounts from OAuth providers.
- `id` - Primary key
- `provider_id` - Unique identifier from OAuth provider
- `display_name` - User's display name
- `avatar_url` - Profile picture URL
- `roles` - Array of role strings (default: ['user'])
- `created_at` - Account creation timestamp

#### parks
Mirror of Sanity CMS park data for efficient relational queries.
- `id` - Primary key
- `cms_id` - Unique Sanity document _id
- `slug` - URL-friendly identifier
- `name` - Park name
- `states` - Array of state codes
- `summary` - Park description
- `hero_url` - Hero image URL
- `lat`, `lng` - Geographic coordinates
- `updated_at` - Last sync timestamp

#### categories
Categories for organizing user content (e.g., "Tips", "Hikes", "Wildlife").
- `id` - Primary key
- `slug` - URL-friendly identifier
- `name` - Category display name

#### things
User-generated posts about parks.
- `id` - Primary key
- `park_id` - Foreign key to parks
- `category_id` - Foreign key to categories
- `author_id` - Foreign key to users
- `title` - Post title
- `body` - Post content
- `status` - Enum: 'published', 'pending', 'removed'
- `created_at`, `updated_at` - Timestamps
- `deleted_at` - Soft delete timestamp

#### thing_images
Images attached to things (multiple per thing).
- `id` - Primary key
- `thing_id` - Foreign key to things
- `url` - Image URL
- `width`, `height` - Dimensions
- `alt` - Alt text for accessibility
- `created_at` - Upload timestamp

#### comments
Comments on things with **one-level replies only**.
- `id` - Primary key
- `thing_id` - Foreign key to things
- `author_id` - Foreign key to users
- `parent_id` - Foreign key to comments (nullable)
- `body` - Comment text
- `created_at`, `updated_at` - Timestamps
- `deleted_at` - Soft delete timestamp

**Important**: One-level replies must be enforced at the application level (see example below). PostgreSQL CHECK constraints cannot use subqueries, so this cannot be enforced at the database level.

#### votes
Polymorphic votes on things or comments.
- `id` - Primary key
- `user_id` - Foreign key to users
- `subject_type` - Enum: 'thing', 'comment'
- `subject_id` - ID of the thing or comment
- `value` - Smallint: -1 (downvote) or 1 (upvote)
- `created_at` - Vote timestamp

**Constraints**: 
- One vote per user per subject (unique)
- Value must be -1 or 1

#### moderation_flags
User-reported content for moderation.
- `id` - Primary key
- `subject_type` - Enum: 'thing', 'comment'
- `subject_id` - ID of flagged content
- `reason` - Description of the issue
- `reporter_id` - Foreign key to users (nullable)
- `resolved_by` - Foreign key to users (nullable)
- `status` - Enum: 'open', 'closed'
- `created_at` - Report timestamp
- `resolved_at` - Resolution timestamp

## Available Scripts

```bash
# Generate a new migration after schema changes
pnpm db:generate

# Apply migrations to the database
pnpm db:migrate

# Push schema directly to database (for development)
pnpm db:push

# Open Drizzle Studio (database GUI)
pnpm db:studio
```

## Usage Examples

### Import the database client

```typescript
import { db, users, parks, things, comments, votes } from '@/db';
```

### Query examples

```typescript
// Get all published things for a park
const parkThings = await db
  .select()
  .from(things)
  .where(
    and(
      eq(things.parkId, parkId),
      eq(things.status, 'published'),
      isNull(things.deletedAt)
    )
  )
  .orderBy(desc(things.createdAt));

// Get comments with author info
const thingComments = await db
  .select()
  .from(comments)
  .innerJoin(users, eq(comments.authorId, users.id))
  .where(
    and(
      eq(comments.thingId, thingId),
      isNull(comments.parentId),
      isNull(comments.deletedAt)
    )
  )
  .orderBy(asc(comments.createdAt));

// Create a vote
await db.insert(votes).values({
  userId: userId,
  subjectType: 'thing',
  subjectId: thingId,
  value: 1, // upvote
});

// Update vote (upsert pattern)
await db
  .insert(votes)
  .values({
    userId: userId,
    subjectType: 'thing',
    subjectId: thingId,
    value: 1,
  })
  .onConflictDoUpdate({
    target: [votes.userId, votes.subjectType, votes.subjectId],
    set: { value: 1 },
  });
```

### Get vote counts

```typescript
const voteData = await db
  .select({
    upvotes: sql<number>`count(*) filter (where ${votes.value} = 1)`,
    downvotes: sql<number>`count(*) filter (where ${votes.value} = -1)`,
  })
  .from(votes)
  .where(
    and(
      eq(votes.subjectType, 'thing'),
      eq(votes.subjectId, thingId)
    )
  );
```

### Enforce one-level replies (application logic)

```typescript
// Helper function to validate comment nesting
async function canReplyToComment(parentId: number): Promise<boolean> {
  const parent = await db
    .select({ parentId: comments.parentId })
    .from(comments)
    .where(eq(comments.id, parentId))
    .limit(1);
  
  if (!parent.length) return false;
  
  // Parent must not have a parent (can't reply to a reply)
  return parent[0].parentId === null;
}

// Usage when creating a comment
if (parentId && !(await canReplyToComment(parentId))) {
  throw new Error('Cannot reply to a reply. Only one level of nesting allowed.');
}

await db.insert(comments).values({
  thingId,
  authorId,
  parentId,
  body,
});
```

## Key Features

### One-Level Reply Constraint
Comments can have replies, but those replies cannot have their own replies. **This must be enforced at the application level** because PostgreSQL CHECK constraints cannot use subqueries. See the usage examples section for implementation.

### Polymorphic Relations
Votes and moderation flags use a polymorphic pattern with `subject_type` and `subject_id` to reference either things or comments.

### Soft Deletes
Things and comments use `deleted_at` timestamps for soft deletion, preserving data integrity.

### Cascade Deletes
- Deleting a park cascades to all things about that park
- Deleting a thing cascades to its images, comments, and votes
- Deleting a comment cascades to its replies
- Deleting a user cascades to their content

### SET NULL on Moderation
When a user is deleted, their moderation flags remain but the user reference is set to NULL.

## Next Steps

1. **Sync Parks**: Create a script to sync Sanity parks to the database
2. **Seed Categories**: Run `pnpm seed:categories` to populate categories
3. **Authentication**: Implement OAuth with user creation
4. **API Routes**: Create Next.js API routes for CRUD operations
5. **Queries**: Use Drizzle queries in your components

## Files Reference

- `db/` - Database schema and configuration
  - `schema/` - Drizzle schema definitions
  - `migrations/` - Generated migration files
  - `index.ts` - Database client and exports
- `sql/schema.sql` - Raw SQL DDL for reference
- `drizzle.config.ts` - Drizzle Kit configuration

