import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getParkBySlug, getParks } from '@/lib/sanity/queries'
import { getThingsByParkSlug } from '@/lib/db/queries'
import { ThingCard } from '@/components/thing-card'
import { ThingsListSkeleton } from '@/components/skeletons'
import { urlFor } from '@/lib/sanity/client'
import Link from 'next/link'

// Generate static params for known parks
export async function generateStaticParams() {
  const parks = await getParks()
  return parks.slice(0, 10).map((park) => ({
    slug: park.slug.current,
  }))
}

interface ParkPageProps {
  params: Promise<{ slug: string }>
}

// Component that handles params and park data fetching
async function ParkContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const park = await getParkBySlug(slug)

  if (!park) {
    notFound()
  }

  const heroImageUrl = park.heroImage?.asset 
    ? urlFor(park.heroImage).width(1200).height(600).url()
    : null

  return (
    <>
      {/* Park Header - Cached in static shell */}
      <div className="bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
          {heroImageUrl && (
            <div className="mb-6 overflow-hidden relative h-64 md:h-96 border-2 border-black">
              <Image
                src={heroImageUrl}
                alt={park.heroImage?.alt || park.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </div>
          )}
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter text-black leading-none mb-4">
            {park.name}
          </h1>
          
          {park.states && park.states.length > 0 && (
            <p className="text-sm md:text-base font-mono uppercase tracking-wider text-gray-700 mb-6">
              {park.states.join(' • ')}
            </p>
          )}

          <Link
            href="/parks"
            className="inline-block px-4 py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors text-sm font-mono uppercase tracking-wider"
          >
            ← Parks
          </Link>
        </div>
      </div>

      {/* Things Section - Streamed with Suspense */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
          <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tighter text-black">
            Recent Things
          </h2>
          <Link
            href="/contribute"
            className="px-4 py-2 border-2 border-black bg-[#1E7B4D] text-white hover:bg-black transition-colors text-sm font-mono uppercase tracking-wider whitespace-nowrap"
          >
            + Add Thing
          </Link>
        </div>

        <Suspense fallback={<ThingsListSkeleton />}>
          <ThingsList slug={slug} />
        </Suspense>
      </div>
    </>
  )
}

export default function ParkPage({ params }: ParkPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={
        <div>
          <div className="bg-white border-b-4 border-black">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
              <div className="animate-pulse">
                <div className="h-96 bg-gray-200 border-2 border-black mb-6"></div>
                <div className="h-12 bg-gray-200 w-1/2 mb-4"></div>
                <div className="h-6 bg-gray-200 w-1/4 mb-6"></div>
                <div className="h-10 bg-gray-200 w-32"></div>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
            <div className="h-10 bg-gray-200 w-1/3 mb-6 border-b-2 border-black pb-4"></div>
            <ThingsListSkeleton />
          </div>
        </div>
      }>
        <ParkContent params={params} />
      </Suspense>
    </div>
  )
}

// Separate component for things list - will be streamed
async function ThingsList({ slug }: { slug: string }) {
  const things = await getThingsByParkSlug(slug)

  if (things.length === 0) {
    return (
      <div className="text-center py-12 bg-white border-2 border-black">
        <p className="text-lg font-mono uppercase tracking-wider text-gray-600">
          No things yet
        </p>
        <p className="mt-2 text-sm text-gray-500">Be the first to share something</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:gap-6">
      {things.map((thing) => (
        <ThingCard key={thing.id} thing={thing} />
      ))}
    </div>
  )
}

