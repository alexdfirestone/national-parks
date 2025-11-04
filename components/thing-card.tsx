import Link from 'next/link'
import Image from 'next/image'

interface ThingCardProps {
  thing: {
    id: number
    title: string
    body: string
    createdAt: Date
    park: {
      name: string
      slug: string
    }
    category: {
      name: string
      slug: string
    }
    author: {
      name: string
    }
    image: {
      url: string
      alt: string | null
    } | null
  }
}

export function ThingCard({ thing }: ThingCardProps) {
  return (
    <Link
      href={`/parks/${thing.park.slug}/things/${thing.id}`}
      className="block bg-white border-2 border-black overflow-hidden hover:border-[#1E7B4D] hover:translate-x-0.5 hover:translate-y-0.5 transition-all group"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section - Left Side */}
        {thing.image && (
          <div className="relative w-full md:w-1/3 h-32 md:h-40 overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-black flex-shrink-0">
            <Image
              src={thing.image.url}
              alt={thing.image.alt || thing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        
        {/* Content Section - Right Side */}
        <div className="p-6 flex-1">
          <div className="mb-3">
            <span className="inline-block px-2 py-1 border border-black text-xs font-mono uppercase tracking-wider">
              {thing.category.name}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tighter text-black mb-3 leading-tight">
            {thing.title}
          </h3>
          <p className="text-gray-700 mb-4 line-clamp-2 text-sm">{thing.body}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-600 pt-3 border-t border-gray-300">
            <span>{thing.author.name}</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span>{new Date(thing.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

