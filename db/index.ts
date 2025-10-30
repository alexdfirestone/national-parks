import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Schema imports
import * as users from './schema/users';
import * as parks from './schema/parks';
import * as categories from './schema/categories';
import * as things from './schema/things';
import * as comments from './schema/comments';
import * as votes from './schema/votes';
import * as moderationFlags from './schema/moderation-flags';

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not defined. Please add it to your .env.local file.'
  );
}

// Create Neon HTTP connection
const sql = neon(databaseUrl);

// Create Drizzle instance with all schemas
export const db = drizzle(sql, {
  schema: {
    ...users,
    ...parks,
    ...categories,
    ...things,
    ...comments,
    ...votes,
    ...moderationFlags,
  },
});

// Re-export all schema tables and types for easy imports
export * from './schema/users';
export * from './schema/parks';
export * from './schema/categories';
export * from './schema/things';
export * from './schema/comments';
export * from './schema/votes';
export * from './schema/moderation-flags';

