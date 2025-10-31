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
    <div className="bg-white border-2 border-black p-6 animate-pulse">
      <div className="h-6 bg-gray-200 w-20 mb-3"></div>
      <div className="h-8 bg-gray-300 w-3/4 mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 w-full"></div>
        <div className="h-4 bg-gray-200 w-5/6"></div>
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-gray-300">
        <div className="h-3 bg-gray-200 w-24"></div>
        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
        <div className="h-3 bg-gray-200 w-20"></div>
      </div>
    </div>
  )
}

export function VotesSkeleton() {
  return (
    <div className="flex items-center gap-4 animate-pulse">
      <div className="h-12 w-12 bg-gray-200 border-2 border-black"></div>
      <div className="h-20 w-20 bg-gray-200 border-2 border-black"></div>
      <div className="h-12 w-12 bg-gray-200 border-2 border-black"></div>
    </div>
  )
}

export function CommentsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 w-40 mb-6 pb-3 border-b-2 border-black"></div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-l-4 border-gray-300 pl-4 py-2 animate-pulse">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-3 bg-gray-300 w-24"></div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="h-3 bg-gray-200 w-20"></div>
            </div>
            <div className="h-4 bg-gray-200 w-full mb-1"></div>
            <div className="h-4 bg-gray-200 w-4/5"></div>
          </div>
        ))}
      </div>
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
    <div className="grid gap-4 md:gap-6">
      {[1, 2, 3, 4].map((i) => (
        <ThingCardSkeleton key={i} />
      ))}
    </div>
  )
}

