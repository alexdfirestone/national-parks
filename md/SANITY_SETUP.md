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

Configure webhooks in your Sanity.io project dashboard:

1. Go to https://sanity.io/manage
2. Select your project
3. Navigate to **API** → **Webhooks**
4. Click **Create webhook**
5. Set URL to: `https://your-domain.com/api/revalidate`
6. Set HTTP method to: **POST**
7. Set Dataset: **production** (or your dataset name)
8. Add projection to send only needed data:
   ```groq
   {
     "_type": _type,
     "slug": slug.current
   }
   ```
9. Trigger on: **Create**, **Update**, **Delete**

## API Revalidation

The `/api/revalidate` endpoint handles cache invalidation:
- For **park** documents: revalidates `park:{slug}`, `parks`, and `nav` tags
- For **category** documents: revalidates `category:{slug}`, `categories`, and `nav` tags

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

