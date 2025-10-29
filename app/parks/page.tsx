import { getParks } from '@/lib/sanity/queries'
import { ParkCard } from '@/components/park-card'
import Link from 'next/link'

export default async function ParksPage() {
  const parks = await getParks()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            National Parks
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Explore America's treasured national parks and discover hidden gems.
          </p>
          <Link
            href="/contribute"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Share Your Discovery
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parks.map((park) => (
            <ParkCard key={park._id} park={park} />
          ))}
        </div>

        {parks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No parks found. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}

