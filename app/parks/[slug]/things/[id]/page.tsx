import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getThingById } from '@/lib/db/queries'
import { Votes } from '@/components/votes'
import { Comments } from '@/components/comments'
import { VotesSkeleton, CommentsSkeleton } from '@/components/skeletons'

interface ThingPageProps {
  params: Promise<{ slug: string; id: string }>
}

// Component that handles params and data fetching
async function ThingContent({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params
  const thing = await getThingById(parseInt(id))

  if (!thing) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Navigation */}
      <div className="mb-8">
        <Link
          href={`/parks/${slug}`}
          className="inline-block px-4 py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors text-sm font-mono uppercase tracking-wider"
        >
          ← {thing.park.name}
        </Link>
      </div>

      {/* Thing Content - Cached in static shell */}
      <article className="bg-white border-2 border-black p-6 md:p-8 mb-6">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 border-2 border-black bg-[#1E7B4D] text-white text-xs font-mono uppercase tracking-wider">
            {thing.category.name}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter text-black leading-tight mb-6">
          {thing.title}
        </h1>

        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-gray-600 mb-8 pb-6 border-b-2 border-black">
          <span>{thing.author.name}</span>
          <span className="w-1 h-1 bg-black rounded-full"></span>
          <span>{new Date(thing.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-800 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
            {thing.body}
          </p>
        </div>
      </article>

      {/* Votes Section - Streamed with Suspense */}
      <div className="bg-white border-2 border-black p-6 mb-6">
        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tighter text-black mb-4 pb-3 border-b-2 border-black">
          Vote
        </h2>
        <Suspense fallback={<VotesSkeleton />}>
          <Votes thingId={thing.id} />
        </Suspense>
      </div>

      {/* Comments Section - Streamed with Suspense */}
      <div className="bg-white border-2 border-black p-6">
        <Suspense fallback={<CommentsSkeleton />}>
          <Comments thingId={thing.id} />
        </Suspense>
      </div>
    </div>
  )
}

export default function ThingPage({ params }: ThingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 border-2 border-black w-48 mb-8"></div>
            <div className="bg-white border-2 border-black p-6 md:p-8">
              <div className="h-8 bg-gray-200 w-32 mb-6"></div>
              <div className="h-12 bg-gray-200 w-2/3 mb-6"></div>
              <div className="h-6 bg-gray-200 w-1/2 mb-8 pb-6 border-b-2 border-black"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200"></div>
                <div className="h-4 bg-gray-200"></div>
                <div className="h-4 bg-gray-200 w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      }>
        <ThingContent params={params} />
      </Suspense>
    </div>
  )
}

