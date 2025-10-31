# Next.js 16 PPR Routes Implementation

This project demonstrates Next.js 16's **Cache Components** and **Partial Prerendering (PPR)** features.

## Architecture Overview

### Cache Strategy

- **CMS Data (Sanity)**: Cached with `use cache` + `cacheTag`, included in static shell
- **UGC (Postgres)**: Streamed with `Suspense` boundaries, short/no cache
- **Mutations**: Server Actions with `updateTag`/`revalidateTag`
- **Runtime**: Node.js (required for Cache Components)

## Routes Implemented

### 1. `/` - Home Page
- Static landing page
- Links to parks and contribute pages

### 2. `/parks` - Parks List
- **Cache**: Full page cached with tags `parks`, `nav`
- **Lifetime**: `cacheLife('hours')`
- Fetches parks from Sanity CMS

### 3. `/parks/[slug]` - Park Detail
- **Static Shell**: Park details from Sanity (cached with tag `park:{slug}`)
- **Dynamic Content**: Things list in `Suspense` boundary (tag: `park:{slug}:things`)
- **Static Params**: Generated for top 10 parks
- Shows park info + user-contributed discoveries

### 4. `/parks/[slug]/things/[id]` - Thing Detail
- **Static Shell**: Thing content (cached with tag `thing:{id}`)
- **Suspense Boundaries**:
  - Votes component (dynamic, tag: `thing:{id}:votes`)
  - Comments list (dynamic, tag: `thing:{id}:comments`)
- Real-time voting and commenting via Server Actions

### 5. `/contribute` - Contribute Page
- Form to submit new discoveries
- Image upload support (Vercel Blob)
- Server Action for submission

## API Routes

### `/api/revalidate` (POST)
- Revalidates cache tags on-demand
- Supports: `park`, `category`, `thing` types
- Triggered by Sanity webhooks or manual calls

### `/api/upload` (POST)
- Handles image uploads to Vercel Blob
- Validates file type and size (max 5MB)
- Returns public URL

## Cache Tags Strategy

| Tag | Used For | Revalidated By |
|-----|----------|----------------|
| `nav` | Navigation data | CMS updates |
| `parks` | All parks list | New park added |
| `park:{slug}` | Individual park | Park updated |
| `park:{slug}:things` | Things for a park | New thing added |
| `thing:{id}` | Thing detail | Thing updated |
| `thing:{id}:votes` | Vote counts | New vote |
| `thing:{id}:comments` | Comments list | New comment |
| `categories` | All categories | Category changes |

## Server Actions

### `createThing(formData)`
- Creates new thing with optional image
- Auto-publishes (in production, would be 'pending')
- Revalidates `park:{slug}:things` tag
- Redirects to park page

### `voteThing(formData)`
- Adds/updates vote (upvote/downvote)
- Uses `updateTag` for immediate refresh
- Prevents duplicate votes per user

### `addComment(formData)`
- Adds comment to a thing
- Supports 1-level replies (no nested threads)
- Uses `updateTag` for immediate refresh

## Key Implementation Details

### 1. Cached Sanity Queries (`lib/sanity/queries.ts`)
```typescript
export async function getParkBySlug(slug: string) {
  'use cache'
  cacheTag(`park:${slug}`)
  cacheLife('hours')
  // ... fetch logic
}
```

### 2. Dynamic UGC Queries (`lib/db/queries.ts`)
```typescript
// No 'use cache' - will be streamed in Suspense
export async function getVotesForThing(thingId: number) {
  // Direct DB query, always fresh
}
```

### 3. Suspense Boundaries
```typescript
<Suspense fallback={<VotesSkeleton />}>
  <Votes thingId={thing.id} />
</Suspense>
```

### 4. Tag Invalidation
```typescript
// Immediate update
updateTag(`thing:${thingId}:votes`)

// Eventual consistency
revalidateTag(`park:${slug}:things`, 'max')
```

## Environment Variables

Required in `.env.local`:

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token

# Database
DATABASE_URL=your_neon_postgres_url

# Blob Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

## PPR Benefits Demonstrated

1. **Fast Initial Load**: Static shell renders instantly
2. **Progressive Enhancement**: Dynamic content streams in
3. **Selective Caching**: Cache stable content, stream volatile data
4. **Granular Invalidation**: Update only what changed
5. **Single HTTP Request**: No waterfalls despite streaming

## Development

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Seed data (if needed)
pnpm seed:all
```

## Next Steps

- Add authentication (replace guest user)
- Add image display for things
- Add moderation workflow
- Add search and filtering
- Add pagination for large lists
- Add optimistic UI updates

