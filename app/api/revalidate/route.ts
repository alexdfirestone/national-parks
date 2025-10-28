import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { _type, slug } = body

    if (!_type || !slug) {
      return NextResponse.json(
        { message: 'Missing _type or slug' },
        { status: 400 }
      )
    }

    // Revalidate specific tags based on content type
    if (_type === 'park') {
      revalidateTag(`park:${slug}`, {})
      revalidateTag('parks', {})
      revalidateTag('nav', {})
    } else if (_type === 'category') {
      revalidateTag(`category:${slug}`, {})
      revalidateTag('categories', {})
      revalidateTag('nav', {})
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      tags: _type === 'park' 
        ? [`park:${slug}`, 'parks', 'nav']
        : [`category:${slug}`, 'categories', 'nav']
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { message: 'Error revalidating', error: String(error) },
      { status: 500 }
    )
  }
}

