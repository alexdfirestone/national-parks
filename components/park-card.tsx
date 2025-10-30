import Link from 'next/link'
import Image from 'next/image'
import { SanityPark } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'

export function ParkCard({ park }: { park: SanityPark }) {
  const imageUrl = park.heroImage?.asset 
    ? urlFor(park.heroImage).width(1200).height(300).url()
    : null

  return (
    <Link
      href={`/parks/${park.slug.current}`}
      className="block w-full border-t-2 border-black bg-white hover:bg-gray-50 transition-all group relative overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        {/* Image Section */}
        <div className="md:col-span-4 h-48 md:h-32 bg-gray-100 relative border-b-2 md:border-b-0 md:border-r-2 border-black overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={park.heroImage?.alt || park.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-300 stroke-[1px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="md:col-span-8 p-6 md:p-8 flex items-center">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-black mb-2 group-hover:text-[#1E7B4D] transition-colors">
                  {park.name}
                </h3>
                {park.states && park.states.length > 0 && (
                  <p className="text-sm md:text-base font-mono uppercase tracking-wider text-gray-600">
                    {park.states.join(' • ')}
                  </p>
                )}
              </div>
              
              {/* Arrow indicator */}
              <div className="flex-shrink-0 w-8 h-8 border border-black rounded-full flex items-center justify-center group-hover:bg-[#1E7B4D] group-hover:border-[#1E7B4D] transition-colors">
                <svg
                  className="w-4 h-4 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover accent line */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-[#1E7B4D] w-0 group-hover:w-full transition-all duration-300"></div>
    </Link>
  )
}

