import Link from 'next/link'
import { SanityPark } from '@/lib/sanity/queries'

export function ParkCard({ park }: { park: SanityPark }) {
  return (
    <Link
      href={`/parks/${park.slug.current}`}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      {park.heroImage?.asset?.url && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img
            src={park.heroImage.asset.url}
            alt={park.heroImage.alt || park.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {park.name}
        </h3>
        {park.states && park.states.length > 0 && (
          <p className="text-sm text-gray-600">{park.states.join(', ')}</p>
        )}
      </div>
    </Link>
  )
}

