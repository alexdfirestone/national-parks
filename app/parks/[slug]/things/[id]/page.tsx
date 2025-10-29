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

export default async function ThingPage({ params }: ThingPageProps) {
  const { slug, id } = await params
  const thing = await getThingById(parseInt(id))

  if (!thing) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href={`/parks/${slug}`}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to {thing.park.name}
          </Link>
        </div>

        {/* Thing Content - Cached in static shell */}
        <article className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {thing.category.name}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {thing.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span>by {thing.author.name}</span>
            <span>•</span>
            <span>{new Date(thing.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              {thing.body}
            </p>
          </div>
        </article>

        {/* Votes Section - Streamed with Suspense */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Vote on this discovery
          </h2>
          <Suspense fallback={<VotesSkeleton />}>
            <Votes thingId={thing.id} />
          </Suspense>
        </div>

        {/* Comments Section - Streamed with Suspense */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Suspense fallback={<CommentsSkeleton />}>
            <Comments thingId={thing.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

