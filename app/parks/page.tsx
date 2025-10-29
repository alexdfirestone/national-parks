import { Suspense } from 'react'
import { getParks } from '@/lib/sanity/queries'
import { ParksSearch } from '@/components/parks-search'
import { ParksListSkeleton } from '@/components/skeletons'

export default function ParksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Brutalist Header */}
      <div className="bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <div className="relative">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter text-black leading-none">
              NATIONAL
              <br />
              <span className="text-[#1E7B4D]">PARKS</span>
            </h1>
            
            {/* Decorative pattern */}
            <div className="absolute -top-4 -right-4 w-24 h-24 hidden lg:block">
              <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
                <circle cx="50" cy="50" r="48" fill="none" stroke="black" strokeWidth="1" />
                <circle cx="50" cy="50" r="36" fill="none" stroke="black" strokeWidth="1" />
                <circle cx="50" cy="50" r="24" fill="none" stroke="black" strokeWidth="1" />
                <circle cx="50" cy="50" r="12" fill="none" stroke="black" strokeWidth="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <Suspense fallback={<ParksListSkeleton />}>
          <ParksList />
        </Suspense>
      </div>
    </div>
  )
}

// Separate component for parks list - will be streamed
async function ParksList() {
  const parks = await getParks()

  if (parks.length === 0) {
    return (
      <div className="border-2 border-black p-12 text-center bg-white">
        <p className="text-xl font-mono uppercase tracking-wider text-gray-600">
          NO PARKS FOUND
        </p>
        <p className="mt-2 text-sm text-gray-500">CHECK BACK SOON</p>
      </div>
    )
  }

  return <ParksSearch parks={parks} />
}

