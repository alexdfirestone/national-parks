import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getParkBySlug, getParks } from '@/lib/sanity/queries'
import { getThingsByParkSlug } from '@/lib/db/queries'
import { ThingCard } from '@/components/thing-card'
import { ThingsListSkeleton } from '@/components/skeletons'
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

export default async function ParkPage({ params }: ParkPageProps) {
  const { slug } = await params
  const park = await getParkBySlug(slug)

  if (!park) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Park Header - Cached in static shell */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {park.heroImage?.asset?.url && (
            <div className="mb-6 rounded-lg overflow-hidden max-h-96">
              <img
                src={park.heroImage.asset.url}
                alt={park.heroImage.alt || park.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {park.name}
          </h1>
          
          {park.states && park.states.length > 0 && (
            <p className="text-lg text-gray-600 mb-4">
              {park.states.join(', ')}
            </p>
          )}

          <Link
            href="/parks"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to all parks
          </Link>
        </div>
      </div>

      {/* Things Section - Streamed with Suspense */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Recent Discoveries
          </h2>
          <Link
            href="/contribute"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Discovery
          </Link>
        </div>

        <Suspense fallback={<ThingsListSkeleton />}>
          <ThingsList slug={slug} />
        </Suspense>
      </div>
    </div>
  )
}

// Separate component for things list - will be streamed
async function ThingsList({ slug }: { slug: string }) {
  const things = await getThingsByParkSlug(slug)

  if (things.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-600">
          No discoveries yet. Be the first to share something!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {things.map((thing) => (
        <ThingCard key={thing.id} thing={thing} />
      ))}
    </div>
  )
}

