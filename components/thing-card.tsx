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
      className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {thing.title}
      </h3>
      <p className="text-gray-700 mb-3 line-clamp-2">{thing.body}</p>
      <div className="flex gap-4 text-sm text-gray-600">
        <span className="font-medium">{thing.category.name}</span>
        <span>by {thing.author.name}</span>
        <span>{new Date(thing.createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  )
}

