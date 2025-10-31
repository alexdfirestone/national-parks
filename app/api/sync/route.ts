import { NextRequest, NextResponse } from 'next/server'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { client } from '@/lib/sanity/client'
import { db, parks, categories } from '@/db'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

// Fetch all parks from Sanity
async function fetchAllParks() {
  try {
    const allParks = await client.fetch(
      `*[_type == "park"] {
        _id,
        name,
        slug,
        states,
        summary,
        heroImage,
        lat,
        lng
      }`,
      {},
      { 
        cache: 'no-store',
        next: { revalidate: 0 }
      }
    )
    return allParks || []
  } catch (error) {
    console.error('Error fetching parks from Sanity:', error)
    throw error
  }
}

// Fetch all categories from Sanity
async function fetchAllCategories() {
  try {
    const allCategories = await client.fetch(
      `*[_type == "category"] {
        _id,
        name,
        slug
      }`,
      {},
      { 
        cache: 'no-store',
        next: { revalidate: 0 }
      }
    )
    return allCategories || []
  } catch (error) {
    console.error('Error fetching categories from Sanity:', error)
    throw error
  }
}

// Transform park data
function transformParkData(data: any) {
  const { _id, slug, name } = data
  
  if (!slug?.current || !name) {
    throw new Error('Missing required fields for park')
  }

  const parkSlug = slug.current

  // Extract summary text from portable text
  let summaryText = null
  if (data.summary && Array.isArray(data.summary)) {
    summaryText = data.summary
      .filter((block: any) => block._type === 'block')
      .map((block: any) => 
        block.children
          ?.filter((child: any) => child._type === 'span')
          .map((child: any) => child.text)
          .join('')
      )
      .join('\n\n')
  }

  // Build hero image URL if available
  let heroUrl = null
  if (data.heroImage?.asset?._ref) {
    const assetId = data.heroImage.asset._ref
    const [, id, dimensions, format] = assetId.match(/image-([a-f0-9]+)-(\d+x\d+)-(\w+)/) || []
    if (id && dimensions && format) {
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
      const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
      heroUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`
    }
  }

  return {
    cmsId: _id,
    slug: parkSlug,
    name: name,
    states: data.states || null,
    summary: summaryText,
    heroUrl: heroUrl,
    lat: data.lat ? String(data.lat) : null,
    lng: data.lng ? String(data.lng) : null,
    updatedAt: new Date(),
  }
}

// Full sync all parks
async function syncAllParks() {
  console.log('🔄 Starting full park sync...')
  const sanityParks = await fetchAllParks()
  const sanityCmsIds = sanityParks.map((p: any) => p._id)
  
  let created = 0
  let updated = 0
  
  // Upsert all parks from Sanity
  for (const sanityPark of sanityParks) {
    try {
      const parkData = transformParkData(sanityPark)
      
      const existingPark = await db
        .select()
        .from(parks)
        .where(eq(parks.cmsId, parkData.cmsId))
        .limit(1)

      if (existingPark.length > 0) {
        await db
          .update(parks)
          .set(parkData)
          .where(eq(parks.cmsId, parkData.cmsId))
        updated++
      } else {
        await db.insert(parks).values(parkData)
        created++
      }
    } catch (error) {
      console.error(`Error syncing park ${sanityPark.name}:`, error)
    }
  }
  
  // Delete parks that don't exist in Sanity anymore
  const allDbParks = await db.select().from(parks)
  let deleted = 0
  
  for (const dbPark of allDbParks) {
    if (!sanityCmsIds.includes(dbPark.cmsId)) {
      await db.delete(parks).where(eq(parks.cmsId, dbPark.cmsId))
      console.log(`🗑️  Deleted park: ${dbPark.name} (not in Sanity)`)
      deleted++
    }
  }
  
  console.log(`✅ Parks sync complete: ${created} created, ${updated} updated, ${deleted} deleted`)
  
  return { created, updated, deleted }
}

// Full sync all categories
async function syncAllCategories() {
  console.log('🔄 Starting full category sync...')
  const sanityCategories = await fetchAllCategories()
  const sanitySlugs = sanityCategories.map((c: any) => c.slug?.current).filter(Boolean)
  
  let created = 0
  let updated = 0
  
  // Upsert all categories from Sanity
  for (const sanityCategory of sanityCategories) {
    try {
      const { slug, name } = sanityCategory
      
      if (!slug?.current || !name) {
        console.warn('Skipping category with missing fields:', sanityCategory)
        continue
      }

      const categorySlug = slug.current
      const categoryData = {
        slug: categorySlug,
        name: name,
      }

      const existingCategory = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, categorySlug))
        .limit(1)

      if (existingCategory.length > 0) {
        await db
          .update(categories)
          .set({ name: name })
          .where(eq(categories.slug, categorySlug))
        updated++
      } else {
        await db.insert(categories).values(categoryData)
        created++
      }
    } catch (error) {
      console.error(`Error syncing category ${sanityCategory.name}:`, error)
    }
  }
  
  // Delete categories that don't exist in Sanity anymore
  const allDbCategories = await db.select().from(categories)
  let deleted = 0
  
  for (const dbCategory of allDbCategories) {
    if (!sanitySlugs.includes(dbCategory.slug)) {
      await db.delete(categories).where(eq(categories.slug, dbCategory.slug))
      console.log(`🗑️  Deleted category: ${dbCategory.name} (not in Sanity)`)
      deleted++
    }
  }
  
  console.log(`✅ Categories sync complete: ${created} created, ${updated} updated, ${deleted} deleted`)
  
  return { created, updated, deleted }
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature validation
    const body = await request.text()
    const signature = request.headers.get(SIGNATURE_HEADER_NAME)

    // Validate webhook signature
    const secret = process.env.SANITY_WEBHOOK_SECRET
    if (!secret) {
      console.warn('SANITY_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { message: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    if (!signature || !(await isValidSignature(body, signature, secret))) {
      return NextResponse.json(
        { message: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    // Parse the webhook payload (for logging/info only)
    const payload = JSON.parse(body)
    const { _type, _id } = payload
    console.log(`📥 Webhook received for ${_type}:${_id}, triggering full sync...`)

    // Perform full sync of ALL parks and categories
    const [parksResult, categoriesResult] = await Promise.all([
      syncAllParks(),
      syncAllCategories(),
    ])

    // Revalidate all cache tags
    revalidateTag('parks', {})
    revalidateTag('categories', {})
    revalidateTag('nav', {})

    console.log('✅ Full sync completed successfully')

    return NextResponse.json({
      success: true,
      message: 'Full sync completed',
      trigger: { type: _type, id: _id },
      results: {
        parks: parksResult,
        categories: categoriesResult,
      },
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { message: 'Error syncing data', error: String(error) },
      { status: 500 }
    )
  }
}

