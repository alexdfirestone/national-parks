import { cacheTag, cacheLife } from 'next/cache'
import { client } from './client'

export interface SanityPark {
  _id: string
  name: string
  slug: { current: string }
  states?: string[]
  summary?: any[]
  heroImage?: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
    alt?: string
  }
  lat?: number
  lng?: number
}

export interface SanityCategory {
  _id: string
  name: string
  slug: { current: string }
}

export async function getParks() {
  'use cache'
  cacheTag('parks', 'nav')
  cacheLife('hours')

  const parks = await client.fetch<SanityPark[]>(
    `*[_type == "park"] | order(name asc) {
      _id,
      name,
      slug,
      states,
      summary,
      heroImage,
      lat,
      lng
    }`
  )

  return parks
}

export async function getParkBySlug(slug: string) {
  'use cache'
  cacheTag(`park:${slug}`)
  cacheLife('hours')

  const park = await client.fetch<SanityPark>(
    `*[_type == "park" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      states,
      summary,
      heroImage,
      lat,
      lng
    }`,
    { slug }
  )

  return park
}

export async function getCategories() {
  'use cache'
  cacheTag('categories', 'nav')
  cacheLife('hours')

  const categories = await client.fetch<SanityCategory[]>(
    `*[_type == "category"] | order(name asc) {
      _id,
      name,
      slug
    }`
  )

  return categories
}

