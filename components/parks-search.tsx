'use client'

import { useState, useMemo } from 'react'
import { SanityPark } from '@/lib/sanity/queries'
import { ParkCard } from './park-card'

interface ParksSearchProps {
  parks: SanityPark[]
}

export function ParksSearch({ parks }: ParksSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredParks = useMemo(() => {
    if (!searchQuery.trim()) {
      return parks
    }

    const query = searchQuery.toLowerCase()
    return parks.filter((park) => {
      const nameMatch = park.name.toLowerCase().includes(query)
      const stateMatch = park.states?.some((state) =>
        state.toLowerCase().includes(query)
      )
      return nameMatch || stateMatch
    })
  }, [parks, searchQuery])

  return (
    <div className="space-y-8">
      {/* Search Input - Large and spanning */}
      <div className="relative">
        <div className="border-2 border-black bg-white">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH PARKS"
            className="w-full px-8 py-6 text-2xl md:text-4xl font-bold uppercase tracking-wider bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-300 text-black"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-black hover:text-[#1E7B4D] transition-colors text-xl md:text-2xl font-bold"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Decorative corner marks - brutalist style */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-black"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-black"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-black"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-black"></div>
      </div>

      {/* Results counter */}
      <div className="flex items-center gap-4 border-b border-black pb-2">
        <span className="text-sm font-mono uppercase tracking-widest">
          RESULTS
        </span>
        <span className="text-xl font-bold tabular-nums">
          {filteredParks.length}
        </span>
        {searchQuery && (
          <span className="text-sm text-gray-600 font-mono">
            / {parks.length} TOTAL
          </span>
        )}
      </div>

      {/* Parks List */}
      {filteredParks.length === 0 ? (
        <div className="border-2 border-black p-12 text-center">
          <p className="text-xl font-mono uppercase tracking-wider text-gray-600">
            NO PARKS FOUND
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-sm font-mono uppercase tracking-widest border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
          >
            CLEAR SEARCH
          </button>
        </div>
      ) : (
        <div className="space-y-0">
          {filteredParks.map((park) => (
            <ParkCard key={park._id} park={park} />
          ))}
        </div>
      )}
    </div>
  )
}

