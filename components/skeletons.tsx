export function ParkCardSkeleton() {
  return (
    <div className="block w-full border-t-2 border-black bg-white animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        {/* Image Section */}
        <div className="md:col-span-4 h-48 md:h-32 bg-gray-200 border-b-2 md:border-b-0 md:border-r-2 border-black"></div>
        
        {/* Content Section */}
        <div className="md:col-span-8 p-6 md:p-8 flex items-center">
          <div className="flex-1">
            <div className="h-8 bg-gray-300 w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ThingCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex gap-4 text-sm">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  )
}

export function VotesSkeleton() {
  return (
    <div className="flex items-center gap-2 animate-pulse">
      <div className="h-8 w-8 bg-gray-300 rounded"></div>
      <div className="h-6 w-12 bg-gray-300 rounded"></div>
      <div className="h-8 w-8 bg-gray-300 rounded"></div>
    </div>
  )
}

export function CommentsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border-l-2 border-gray-200 pl-4 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      ))}
    </div>
  )
}

export function ParksListSkeleton() {
  return (
    <div className="space-y-8">
      {/* Search skeleton */}
      <div className="relative">
        <div className="border-2 border-black bg-white">
          <div className="w-full px-8 py-6 h-20 md:h-24 bg-gray-100 animate-pulse"></div>
        </div>
        <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-black"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-black"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-black"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-black"></div>
      </div>

      {/* Results counter skeleton */}
      <div className="flex items-center gap-4 border-b border-black pb-2">
        <div className="h-4 bg-gray-300 w-20 animate-pulse"></div>
        <div className="h-6 bg-gray-300 w-8 animate-pulse"></div>
      </div>

      {/* Parks list skeleton */}
      <div className="space-y-0">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ParkCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function ThingsListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <ThingCardSkeleton key={i} />
      ))}
    </div>
  )
}

