# Sanity CMS Setup

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_SANITY_STUDIO_URL=https://your-project.sanity.studio

# Webhook Configuration (for Sanity Studio)
NEXT_PUBLIC_REVALIDATE_WEBHOOK_URL=https://your-domain.com/api/revalidate
```

## Running Sanity Studio

**First time setup:**
1. Update `.env.local` with your actual Sanity project ID and dataset name

Run the studio locally:

```bash
npm run sanity:dev
```

This will start the Sanity Studio at http://localhost:3333

Deploy to Sanity.io:

```bash
npm run sanity:deploy
```

This will deploy your studio to https://your-project.sanity.studio

## Schemas

### Park Schema
- **name** (string, required) - Name of the park
- **slug** (slug, required) - URL-friendly identifier
- **states** (array of strings) - States where the park is located
- **summary** (portable text) - Rich text description
- **heroImage** (image with alt text) - Main park image
- **lat** (number) - Latitude coordinate
- **lng** (number) - Longitude coordinate

### Category Schema
- **name** (string, required) - Category name
- **slug** (slug, required) - URL-friendly identifier

## Webhooks

You need to configure **two webhooks** in your Sanity.io project dashboard:

### 1. Sync Webhook (Database Sync)

This webhook automatically syncs parks and categories from Sanity CMS to your database.

1. Go to https://sanity.io/manage
2. Select your project
3. Navigate to **API** → **Webhooks**
4. Click **Create webhook**
5. Configure:
   - **Name**: "Database Sync"
   - **URL**: `https://your-domain.com/api/sync`
   - **HTTP method**: POST
   - **Dataset**: production (or your dataset name)
   - **Filter**: `_type == "park" || _type == "category"`
   - **Trigger on**: Create, Update, Delete
   - **Secret**: Use the same value as `SANITY_WEBHOOK_SECRET` in your `.env.local`
6. Projection (send full document data for create/update, minimal for delete):
   ```groq
   {
     "_id": _id,
     "_type": _type,
     "name": name,
     "slug": slug,
     "states": states,
     "summary": summary,
     "heroImage": heroImage,
     "lat": lat,
     "lng": lng
   }
   ```
   
   **Note**: On delete operations, only `_id`, `_type`, and `slug` will be available. This is sufficient for the sync endpoint to identify and delete the correct records.

**Important**: The webhook secret must match the `SANITY_WEBHOOK_SECRET` in your environment variables. Generate one with:
```bash
openssl rand -hex 32
```

### 2. Revalidation Webhook (Cache Invalidation)

This webhook invalidates Next.js cache when content changes.

1. Create another webhook with:
   - **Name**: "Cache Revalidation"
   - **URL**: `https://your-domain.com/api/revalidate`
   - **HTTP method**: POST
   - **Dataset**: production (or your dataset name)
   - **Trigger on**: Create, Update, Delete
2. Projection (minimal data):
   ```groq
   {
     "_type": _type,
     "slug": slug.current,
     "id": _id
   }
   ```

## API Endpoints

### `/api/sync` - Database Sync

Automatically syncs parks and categories from Sanity to your database:
- **Create**: Inserts new records (matched by slug)
- **Update**: Updates existing records with latest CMS data (matched by slug)
- **Delete**: Removes records from database
  - Parks: Matched by `cmsId` (_id from Sanity)
  - Categories: Matched by `slug` (requires slug in webhook projection)
- Validates webhook signature for security (HMAC SHA-256)
- Triggers cache revalidation after all operations
- Database cascade deletes: Deleting parks or categories will automatically remove related things

### `/api/revalidate` - Cache Invalidation

Handles Next.js cache invalidation:
- For **park** documents: revalidates `park:{slug}`, `parks`, and `nav` tags
- For **category** documents: revalidates `category:{slug}`, `categories`, and `nav` tags
- For **thing** documents: revalidates thing-specific tags

## Using the Sanity Client

Import the client in your Next.js components:

```typescript
import { client } from '@/lib/sanity/client'

// Example query
const parks = await client.fetch(`*[_type == "park"]{ name, slug, states }`)
```

## Deploying to Sanity.io

```bash
npm run sanity:deploy
```

This will deploy your studio to `https://your-project.sanity.studio`

