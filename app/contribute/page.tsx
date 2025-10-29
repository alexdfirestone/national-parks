import { getParks } from '@/lib/sanity/queries'
import { getCategoriesFromDb } from '@/lib/db/queries'
import { ContributeForm } from '@/components/contribute-form'
import Link from 'next/link'

export default async function ContributePage() {
  // Fetch parks from Sanity (cached)
  const sanityParks = await getParks()
  
  // Fetch parks from DB to get proper IDs
  const { db, parks: parksTable } = await import('@/db')
  const dbParks = await db.select().from(parksTable)
  
  // Match Sanity parks with DB parks by slug
  const parks = sanityParks.map((sanityPark) => {
    const dbPark = dbParks.find((p) => p.slug === sanityPark.slug.current)
    return {
      id: dbPark?.id || 0,
      name: sanityPark.name,
      slug: sanityPark.slug.current,
    }
  }).filter((park) => park.id !== 0) // Only show parks that exist in DB

  // Fetch categories from DB
  const categories = await getCategoriesFromDb()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/parks"
            className="text-blue-600 hover:text-blue-800 transition-colors mb-4 inline-block"
          >
            ← Back to parks
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Share Your Discovery
          </h1>
          <p className="text-lg text-gray-600">
            Found something interesting at a national park? Share it with the community!
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <ContributeForm
            parks={parks}
            categories={categories}
            userName="Guest User"
            userProviderId="guest-user-id"
          />
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            Guidelines for submissions:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Be respectful and constructive</li>
            <li>Share genuine discoveries and experiences</li>
            <li>Include relevant details and context</li>
            <li>Add photos when possible to illustrate your discovery</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

