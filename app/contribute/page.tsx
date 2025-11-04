import { Suspense } from 'react'
import { getParks } from '@/lib/sanity/queries'
import { getCategoriesFromDb, getParksFromDb } from '@/lib/db/queries'
import { ContributeForm } from '@/components/contribute-form'
import Link from 'next/link'

async function ContributeFormContent({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>
}) {
  const { returnTo } = await searchParams
  
  // Fetch parks from Sanity (cached)
  const sanityParks = await getParks()
  
  // Fetch parks from DB to get proper IDs (now cached!)
  const dbParks = await getParksFromDb()
  
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
    <>
      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="bg-white border-2 border-black p-6 md:p-8 mb-6">
          <ContributeForm
            parks={parks}
            categories={categories}
            userName="Guest User"
            userProviderId="guest-user-id"
            returnTo={returnTo}
          />
        </div>

        {/* Guidelines Section */}
        <div className="bg-white border-2 border-black p-6">
          <h3 className="text-lg md:text-xl font-bold uppercase tracking-tighter text-black mb-4 pb-3 border-b-2 border-black">
            Guidelines
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-[#1E7B4D] rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-sm text-gray-800">Be respectful and constructive</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-[#1E7B4D] rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-sm text-gray-800">Share genuine experiences and insights</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-[#1E7B4D] rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-sm text-gray-800">Include relevant details and context</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 bg-[#1E7B4D] rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-sm text-gray-800">Add photos when possible to illustrate your post</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

async function BackLink({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>
}) {
  const { returnTo } = await searchParams
  
  return (
    <Link
      href={returnTo || "/parks"}
      className="inline-block px-4 py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors text-sm font-mono uppercase tracking-wider mb-6"
    >
      ← Back
    </Link>
  )
}

export default function ContributePage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <Suspense fallback={
            <Link
              href="/parks"
              className="inline-block px-4 py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors text-sm font-mono uppercase tracking-wider mb-6"
            >
              ← Back
            </Link>
          }>
            <BackLink searchParams={searchParams} />
          </Suspense>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter text-black leading-none mb-4">
            Share Your
            <br />
            <span className="text-[#1E7B4D]">Thing</span>
          </h1>
          <p className="text-sm md:text-base font-mono uppercase tracking-wider text-gray-700">
            Found something interesting? Share it with the community
          </p>
        </div>
      </div>

      <Suspense fallback={
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="bg-white border-2 border-black p-6 md:p-8 mb-6">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      }>
        <ContributeFormContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

