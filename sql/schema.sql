-- National Parks Database Schema
-- PostgreSQL DDL for Neon Database

-- =============================================================================
-- ENUMS
-- =============================================================================

-- Thing status enum
CREATE TYPE thing_status AS ENUM ('published', 'pending', 'removed');

-- Subject type enum (for polymorphic relations)
CREATE TYPE subject_type AS ENUM ('thing', 'comment');

-- Moderation flag status enum
CREATE TYPE flag_status AS ENUM ('open', 'closed');

-- =============================================================================
-- TABLES
-- =============================================================================

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    provider_id TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    roles TEXT[] NOT NULL DEFAULT ARRAY['user']::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Parks table (mirror of Sanity CMS data)
CREATE TABLE parks (
    id SERIAL PRIMARY KEY,
    cms_id TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    states TEXT[],
    summary TEXT,
    hero_url TEXT,
    lat NUMERIC,
    lng NUMERIC,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);

-- Things table (user-generated content about parks)
CREATE TABLE things (
    id SERIAL PRIMARY KEY,
    park_id INTEGER NOT NULL REFERENCES parks(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    status thing_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Thing images table (multiple images per thing)
CREATE TABLE thing_images (
    id SERIAL PRIMARY KEY,
    thing_id INTEGER NOT NULL REFERENCES things(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    width INTEGER,
    height INTEGER,
    alt TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments table (one-level replies enforced at application level)
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    thing_id INTEGER NOT NULL REFERENCES things(id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
    
    -- NOTE: One-level reply constraint cannot be enforced with CHECK 
    -- (PostgreSQL does not allow subqueries in CHECK constraints)
    -- Must be enforced at application level: prevent replies to replies
);

-- Votes table (polymorphic: votes on things or comments)
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_type subject_type NOT NULL,
    subject_id INTEGER NOT NULL,
    value SMALLINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- One vote per user per subject
    CONSTRAINT votes_user_subject_unique UNIQUE (user_id, subject_type, subject_id),
    
    -- Vote value must be -1 (downvote) or 1 (upvote)
    CONSTRAINT votes_value_check CHECK (value IN (-1, 1))
);

-- Moderation flags table (polymorphic: flags on things or comments)
CREATE TABLE moderation_flags (
    id SERIAL PRIMARY KEY,
    subject_type subject_type NOT NULL,
    subject_id INTEGER NOT NULL,
    reason TEXT NOT NULL,
    reporter_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    resolved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status flag_status NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Users indexes
CREATE INDEX users_provider_id_idx ON users(provider_id);

-- Parks indexes
CREATE INDEX parks_cms_id_idx ON parks(cms_id);
CREATE INDEX parks_slug_idx ON parks(slug);

-- Categories indexes
CREATE INDEX categories_slug_idx ON categories(slug);

-- Things indexes
CREATE INDEX things_park_id_idx ON things(park_id);
CREATE INDEX things_category_park_idx ON things(category_id, park_id);
CREATE INDEX things_created_at_idx ON things(created_at DESC);
CREATE INDEX things_author_id_idx ON things(author_id);

-- Thing images indexes
CREATE INDEX thing_images_thing_id_idx ON thing_images(thing_id);

-- Comments indexes
CREATE INDEX comments_thing_created_idx ON comments(thing_id, created_at);
CREATE INDEX comments_parent_id_idx ON comments(parent_id);

-- Votes indexes
CREATE INDEX votes_subject_idx ON votes(subject_type, subject_id);

-- Moderation flags indexes
CREATE INDEX moderation_flags_status_created_idx ON moderation_flags(status, created_at);
CREATE INDEX moderation_flags_subject_idx ON moderation_flags(subject_type, subject_id);

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE users IS 'User accounts from OAuth providers';
COMMENT ON TABLE parks IS 'Mirror of Sanity CMS park data for relational queries';
COMMENT ON TABLE categories IS 'Categories for user-generated things (e.g., tips, hikes, wildlife)';
COMMENT ON TABLE things IS 'User-generated content about parks';
COMMENT ON TABLE thing_images IS 'Images attached to things';
COMMENT ON TABLE comments IS 'Comments on things with one-level replies (enforced at app level)';
COMMENT ON TABLE votes IS 'Upvotes/downvotes on things and comments';
COMMENT ON TABLE moderation_flags IS 'User-reported content for moderation';

COMMENT ON CONSTRAINT votes_value_check ON votes IS 'Votes must be either -1 (downvote) or 1 (upvote)';
COMMENT ON CONSTRAINT votes_user_subject_unique ON votes IS 'Users can only vote once per subject (thing or comment)';

-- Note: One-level reply constraint must be enforced in application code
-- Check before inserting: if parent_id is set, verify that parent has no parent_id

-- =============================================================================
-- SAMPLE QUERIES
-- =============================================================================

-- Get all things for a park with vote counts:
-- SELECT 
--   t.*,
--   COUNT(CASE WHEN v.value = 1 THEN 1 END) as upvotes,
--   COUNT(CASE WHEN v.value = -1 THEN 1 END) as downvotes
-- FROM things t
-- LEFT JOIN votes v ON v.subject_type = 'thing' AND v.subject_id = t.id
-- WHERE t.park_id = $1 AND t.status = 'published' AND t.deleted_at IS NULL
-- GROUP BY t.id
-- ORDER BY t.created_at DESC;

-- Get comments for a thing with reply counts:
-- SELECT 
--   c.*,
--   (SELECT COUNT(*) FROM comments WHERE parent_id = c.id) as reply_count
-- FROM comments c
-- WHERE c.thing_id = $1 AND c.parent_id IS NULL AND c.deleted_at IS NULL
-- ORDER BY c.created_at ASC;

-- Get replies for a comment:
-- SELECT * FROM comments 
-- WHERE parent_id = $1 AND deleted_at IS NULL
-- ORDER BY created_at ASC;

