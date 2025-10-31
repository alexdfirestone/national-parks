import { NextRequest, NextResponse } from 'next/server'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { client } from '@/lib/sanity/client'
import { db, parks, categories } from '@/db'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

// Fetch document from Sanity by ID
async function fetchSanityDocument(id: string, type: string) {
  try {
    if (type === 'park') {
      const park = await client.fetch(
        `*[_type == "park" && _id == $id][0] {
          _id,
          name,
          slug,
          states,
          summary,
          heroImage,
          lat,
          lng
        }`,
        { id },
        { 
          cache: 'no-store',
          next: { revalidate: 0 }
        }
      )
      return park
    } else if (type === 'category') {
      const category = await client.fetch(
        `*[_type == "category" && _id == $id][0] {
          _id,
          name,
          slug
        }`,
        { id },
        { 
          cache: 'no-store',
          next: { revalidate: 0 }
        }
      )
      return category
    }
    return null
  } catch (error) {
    console.error(`Error fetching ${type} from Sanity:`, error)
    return null
  }
}

// Transform and upsert park
async function upsertPark(data: any) {
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

  // Prepare park data
  const parkData = {
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

  // Check if park exists
  const existingPark = await db
    .select()
    .from(parks)
    .where(eq(parks.cmsId, _id))
    .limit(1)

  let action = 'created'
  if (existingPark.length > 0) {
    // Update existing park
    await db
      .update(parks)
      .set(parkData)
      .where(eq(parks.cmsId, _id))
    action = 'updated'
    console.log(`✅ Updated park: ${name} (${parkSlug})`)
  } else {
    // Insert new park
    await db.insert(parks).values(parkData)
    console.log(`✅ Created park: ${name} (${parkSlug})`)
  }

  // Revalidate cache tags
  revalidateTag('parks', {})
  revalidateTag('nav', {})
  revalidateTag(`park:${parkSlug}`, {})

  return { action, slug: parkSlug }
}

// Delete park
async function deletePark(id: string) {
  const existingPark = await db
    .select()
    .from(parks)
    .where(eq(parks.cmsId, id))
    .limit(1)

  if (existingPark.length > 0) {
    const parkSlug = existingPark[0].slug
    await db.delete(parks).where(eq(parks.cmsId, id))
    console.log(`🗑️  Deleted park: ${existingPark[0].name} (${parkSlug})`)

    // Revalidate cache tags
    revalidateTag('parks', {})
    revalidateTag('nav', {})
    revalidateTag(`park:${parkSlug}`, {})
    revalidateTag(`park:${parkSlug}:things`, {})

    return { slug: parkSlug }
  }
  
  return null
}

// Transform and upsert category
async function upsertCategory(data: any) {
  const { _id, slug, name } = data

  if (!slug?.current || !name) {
    throw new Error('Missing required fields for category')
  }

  const categorySlug = slug.current

  // Prepare category data
  const categoryData = {
    slug: categorySlug,
    name: name,
  }

  // Check if category exists
  const existingCategory = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, categorySlug))
    .limit(1)

  let action = 'created'
  if (existingCategory.length > 0) {
    // Update existing category
    await db
      .update(categories)
      .set({ name: name })
      .where(eq(categories.slug, categorySlug))
    action = 'updated'
    console.log(`✅ Updated category: ${name} (${categorySlug})`)
  } else {
    // Insert new category
    await db.insert(categories).values(categoryData)
    console.log(`✅ Created category: ${name} (${categorySlug})`)
  }

  // Revalidate cache tags
  revalidateTag('categories', {})
  revalidateTag('nav', {})
  revalidateTag(`category:${categorySlug}`, {})

  return { action, slug: categorySlug }
}

// Delete category
async function deleteCategory(id: string) {
  const existingCategory = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, id))
    .limit(1)

  if (existingCategory.length > 0) {
    const categorySlug = existingCategory[0].slug
    await db.delete(categories).where(eq(categories.slug, categorySlug))
    console.log(`🗑️  Deleted category: ${existingCategory[0].name} (${categorySlug})`)

    // Revalidate cache tags
    revalidateTag('categories', {})
    revalidateTag('nav', {})
    revalidateTag(`category:${categorySlug}`, {})

    return { slug: categorySlug }
  }
  
  return null
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

    // Parse the webhook payload
    const payload = JSON.parse(body)
    const { _type, _id } = payload

    if (!_type || !_id) {
      return NextResponse.json(
        { message: 'Missing _type or _id in payload' },
        { status: 400 }
      )
    }

    // Validate document type
    if (_type !== 'park' && _type !== 'category') {
      return NextResponse.json(
        { message: 'Invalid _type. Must be park or category' },
        { status: 400 }
      )
    }

    // Fetch the full document from Sanity
    const document = await fetchSanityDocument(_id, _type)

    // If document exists in Sanity, upsert it
    if (document) {
      if (_type === 'park') {
        const { action, slug } = await upsertPark(document)
        return NextResponse.json({
          synced: true,
          type: 'park',
          slug,
          action,
        })
      } else if (_type === 'category') {
        const { action, slug } = await upsertCategory(document)
        return NextResponse.json({
          synced: true,
          type: 'category',
          slug,
          action,
        })
      }
    } else {
      // Document doesn't exist in Sanity (deleted), remove from database
      if (_type === 'park') {
        const result = await deletePark(_id)
        if (result) {
          return NextResponse.json({
            synced: true,
            type: 'park',
            slug: result.slug,
            action: 'deleted',
          })
        }
      } else if (_type === 'category') {
        const result = await deleteCategory(_id)
        if (result) {
          return NextResponse.json({
            synced: true,
            type: 'category',
            slug: result.slug,
            action: 'deleted',
          })
        }
      }

      // Document not found in either Sanity or local DB
      return NextResponse.json({
        synced: true,
        message: 'Document not found in Sanity or local database',
      })
    }

    return NextResponse.json(
      { message: 'Unknown error occurred' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { message: 'Error syncing data', error: String(error) },
      { status: 500 }
    )
  }
}

