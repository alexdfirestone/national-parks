import { cacheTag, cacheLife } from 'next/cache'
import { db, things, votes, comments, users, parks, categories, thingImages } from '@/db'
import { eq, desc, and, sql, isNull, inArray } from 'drizzle-orm'

// Get things for a specific park (streamed, not cached in static shell)
export async function getThingsByParkSlug(parkSlug: string) {
  'use cache'
  cacheTag(`park:${parkSlug}:things`)
  cacheLife('minutes') // Short cache for UGC

  const result = await db
    .select({
      id: things.id,
      title: things.title,
      body: things.body,
      status: things.status,
      createdAt: things.createdAt,
      park: {
        name: parks.name,
        slug: parks.slug,
      },
      category: {
        name: categories.name,
        slug: categories.slug,
      },
      author: {
        id: users.id,
        name: users.displayName,
      },
    })
    .from(things)
    .innerJoin(parks, eq(things.parkId, parks.id))
    .innerJoin(categories, eq(things.categoryId, categories.id))
    .innerJoin(users, eq(things.authorId, users.id))
    .where(and(eq(parks.slug, parkSlug), eq(things.status, 'published'), isNull(things.deletedAt)))
    .orderBy(desc(things.createdAt))
    .limit(50)

  // Fetch first image for each thing
  if (result.length > 0) {
    const thingIds = result.map((t) => t.id)
    
    // Get all images for these things, ordered by creation date
    const images = await db
      .select({
        thingId: thingImages.thingId,
        url: thingImages.url,
        alt: thingImages.alt,
      })
      .from(thingImages)
      .where(inArray(thingImages.thingId, thingIds))
      .orderBy(thingImages.createdAt)

    // Create a map of thingId -> first image
    const imageMap = new Map<number, { url: string; alt: string | null }>()
    for (const image of images) {
      if (!imageMap.has(image.thingId)) {
        imageMap.set(image.thingId, { url: image.url, alt: image.alt })
      }
    }

    // Add first image to each thing
    return result.map((thing) => ({
      ...thing,
      image: imageMap.get(thing.id) || null,
    }))
  }

  return result.map((thing) => ({
    ...thing,
    image: null,
  }))
}

// Get a single thing by ID (cached in static shell)
export async function getThingById(id: number) {
  'use cache'
  cacheTag(`thing:${id}`)
  cacheLife('minutes')

  const result = await db
    .select({
      id: things.id,
      title: things.title,
      body: things.body,
      status: things.status,
      createdAt: things.createdAt,
      park: {
        id: parks.id,
        name: parks.name,
        slug: parks.slug,
      },
      category: {
        name: categories.name,
        slug: categories.slug,
      },
      author: {
        id: users.id,
        name: users.displayName,
      },
    })
    .from(things)
    .innerJoin(parks, eq(things.parkId, parks.id))
    .innerJoin(categories, eq(things.categoryId, categories.id))
    .innerJoin(users, eq(things.authorId, users.id))
    .where(and(eq(things.id, id), isNull(things.deletedAt)))
    .limit(1)

  const thing = result[0]
  if (!thing) return null

  // Fetch images separately
  const images = await db
    .select({
      id: thingImages.id,
      url: thingImages.url,
      alt: thingImages.alt,
    })
    .from(thingImages)
    .where(eq(thingImages.thingId, id))

  return {
    ...thing,
    images,
  }
}

// Get vote counts for a thing (streamed, very short cache)
export async function getVotesForThing(thingId: number) {
  // No 'use cache' - this will be dynamic and streamed
  const result = await db
    .select({
      total: sql<number>`COALESCE(SUM(${votes.value}), 0)::int`,
      upvotes: sql<number>`COALESCE(SUM(CASE WHEN ${votes.value} = 1 THEN 1 ELSE 0 END), 0)::int`,
      downvotes: sql<number>`COALESCE(SUM(CASE WHEN ${votes.value} = -1 THEN 1 ELSE 0 END), 0)::int`,
    })
    .from(votes)
    .where(and(eq(votes.subjectType, 'thing'), eq(votes.subjectId, thingId)))

  return result[0] || { total: 0, upvotes: 0, downvotes: 0 }
}

// Get comments for a thing (streamed, very short cache)
export async function getCommentsForThing(thingId: number) {
  // No 'use cache' - this will be dynamic and streamed
  const result = await db
    .select({
      id: comments.id,
      body: comments.body,
      createdAt: comments.createdAt,
      parentId: comments.parentId,
      author: {
        id: users.id,
        name: users.displayName,
      },
    })
    .from(comments)
    .innerJoin(users, eq(comments.authorId, users.id))
    .where(and(eq(comments.thingId, thingId), isNull(comments.deletedAt)))
    .orderBy(comments.createdAt)
    .limit(100)

  return result
}

// Get categories for the contribute form
export async function getCategoriesFromDb() {
  'use cache'
  cacheTag('categories')
  cacheLife('hours')

  const result = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(categories)
    .orderBy(categories.name)

  return result
}

// Get all parks from DB (for contribute form)
export async function getParksFromDb() {
  'use cache'
  cacheTag('parks')
  cacheLife('hours')

  const result = await db
    .select({
      id: parks.id,
      name: parks.name,
      slug: parks.slug,
    })
    .from(parks)
    .orderBy(parks.name)

  return result
}

// Get park ID by slug (helper for mutations)
export async function getParkIdBySlug(slug: string) {
  const result = await db
    .select({ id: parks.id })
    .from(parks)
    .where(eq(parks.slug, slug))
    .limit(1)

  return result[0]?.id
}

