import { NextRequest, NextResponse } from 'next/server'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { db, parks, categories } from '@/db'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

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

    // Parse the body
    const data = JSON.parse(body)
    const { _type, _id, slug, name } = data

    // Handle park sync
    if (_type === 'park') {
      // Check if this is a delete operation (missing required fields)
      if (!name || !slug?.current) {
        // This is likely a delete operation
        if (_id) {
          // Try to find and delete by cmsId
          const existingPark = await db
            .select()
            .from(parks)
            .where(eq(parks.cmsId, _id))
            .limit(1)

          if (existingPark.length > 0) {
            await db.delete(parks).where(eq(parks.cmsId, _id))
            
            const parkSlug = existingPark[0].slug
            console.log(`🗑️  Deleted park: ${existingPark[0].name} (${parkSlug})`)

            // Revalidate cache tags
            revalidateTag('parks', {})
            revalidateTag('nav', {})
            revalidateTag(`park:${parkSlug}`, {})
            revalidateTag(`park:${parkSlug}:things`, {})

            return NextResponse.json({
              synced: true,
              type: 'park',
              slug: parkSlug,
              action: 'deleted',
            })
          }
        }

        return NextResponse.json(
          { message: 'Missing required fields for park and unable to delete' },
          { status: 400 }
        )
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
        .where(eq(parks.slug, parkSlug))
        .limit(1)

      if (existingPark.length > 0) {
        // Update existing park
        await db
          .update(parks)
          .set(parkData)
          .where(eq(parks.slug, parkSlug))
        
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

      return NextResponse.json({
        synced: true,
        type: 'park',
        slug: parkSlug,
        action: existingPark.length > 0 ? 'updated' : 'created',
      })
    }

    // Handle category sync
    if (_type === 'category') {
      // Check if this is a delete operation (missing name but have slug)
      if (!name && slug?.current) {
        // This is a delete operation
        const categorySlug = slug.current
        
        const existingCategory = await db
          .select()
          .from(categories)
          .where(eq(categories.slug, categorySlug))
          .limit(1)

        if (existingCategory.length > 0) {
          await db.delete(categories).where(eq(categories.slug, categorySlug))
          console.log(`🗑️  Deleted category: ${existingCategory[0].name} (${categorySlug})`)

          // Revalidate cache tags
          revalidateTag('categories', {})
          revalidateTag('nav', {})
          revalidateTag(`category:${categorySlug}`, {})

          return NextResponse.json({
            synced: true,
            type: 'category',
            slug: categorySlug,
            action: 'deleted',
          })
        }

        return NextResponse.json(
          { message: 'Category not found for deletion' },
          { status: 404 }
        )
      }

      // For create/update, both name and slug are required
      if (!slug?.current || !name) {
        return NextResponse.json(
          { message: 'Missing required fields for category' },
          { status: 400 }
        )
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

      if (existingCategory.length > 0) {
        // Update existing category
        await db
          .update(categories)
          .set({ name: name })
          .where(eq(categories.slug, categorySlug))
        
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

      return NextResponse.json({
        synced: true,
        type: 'category',
        slug: categorySlug,
        action: existingCategory.length > 0 ? 'updated' : 'created',
      })
    }

    return NextResponse.json(
      { message: 'Invalid _type. Must be park or category' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { message: 'Error syncing data', error: String(error) },
      { status: 500 }
    )
  }
}

