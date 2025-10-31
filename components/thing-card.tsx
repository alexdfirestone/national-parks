import Link from 'next/link'

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
  }
}

export function ThingCard({ thing }: ThingCardProps) {
  return (
    <Link
      href={`/parks/${thing.park.slug}/things/${thing.id}`}
      className="block bg-white border-2 border-black p-6 hover:border-[#1E7B4D] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
    >
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
    </Link>
  )
}

