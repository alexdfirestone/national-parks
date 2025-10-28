# Environment Variables Setup

Create a `.env.local` file in the project root with these variables:

```bash
# Database (server-side only)
DATABASE_URL=

# Sanity Studio (server and client)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_SANITY_STUDIO_URL=

# Sanity API (server-side only, for seeding scripts)
SANITY_API_TOKEN=

# Alternative Sanity Studio config (fallback)
SANITY_STUDIO_PROJECT_ID=
SANITY_STUDIO_DATASET=
```

## How to Fill In

### DATABASE_URL
Get this from your Neon dashboard:
1. Go to [console.neon.tech](https://console.neon.tech)
2. Select your project
3. Copy the connection string from Connection Details
4. Format: `postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`

### Sanity Variables
You likely already have these set up. If not:
1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Find your project ID
3. Dataset name (usually 'production' or 'development')

### SANITY_API_TOKEN
Only needed if you're running seed scripts that write to Sanity.
1. Go to sanity.io/manage → Your Project → API → Tokens
2. Create a token with write permissions

