import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { _type, slug, id } = body

    const tagsToRevalidate: string[] = []

    // Revalidate specific tags based on content type
    if (_type === 'park') {
      if (!slug) {
        return NextResponse.json(
          { message: 'Missing slug for park revalidation' },
          { status: 400 }
        )
      }
      revalidateTag(`park:${slug}`, {})
      revalidateTag(`park:${slug}:things`, {})
      revalidateTag('parks', {})
      revalidateTag('nav', {})
      tagsToRevalidate.push(`park:${slug}`, `park:${slug}:things`, 'parks', 'nav')
    } else if (_type === 'category') {
      if (!slug) {
        return NextResponse.json(
          { message: 'Missing slug for category revalidation' },
          { status: 400 }
        )
      }
      revalidateTag(`category:${slug}`, {})
      revalidateTag('categories', {})
      revalidateTag('nav', {})
      tagsToRevalidate.push(`category:${slug}`, 'categories', 'nav')
    } else if (_type === 'thing') {
      if (!id) {
        return NextResponse.json(
          { message: 'Missing id for thing revalidation' },
          { status: 400 }
        )
      }
      revalidateTag(`thing:${id}`, {})
      revalidateTag(`thing:${id}:votes`, {})
      revalidateTag(`thing:${id}:comments`, {})
      tagsToRevalidate.push(`thing:${id}`, `thing:${id}:votes`, `thing:${id}:comments`)
      
      // Also revalidate park's things list if slug provided
      if (slug) {
        revalidateTag(`park:${slug}:things`, {})
        tagsToRevalidate.push(`park:${slug}:things`)
      }
    } else {
      return NextResponse.json(
        { message: 'Invalid _type. Must be park, category, or thing' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      tags: tagsToRevalidate
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { message: 'Error revalidating', error: String(error) },
      { status: 500 }
    )
  }
}

