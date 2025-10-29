import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            National Parks Explorer
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover hidden gems, share your experiences, and explore America's most
            treasured national parks. Built with Next.js 16 Partial Prerendering.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/parks"
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              Explore Parks
            </Link>
            <Link
              href="/contribute"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors text-lg"
            >
              Share Discovery
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-4">🏞️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Explore Parks
            </h3>
            <p className="text-gray-600">
              Browse through America's national parks and discover what makes each one unique.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Share & Discuss
            </h3>
            <p className="text-gray-600">
              Share your discoveries, vote on favorites, and engage in discussions with the community.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Lightning Fast
            </h3>
            <p className="text-gray-600">
              Experience instant page loads with Next.js 16's Partial Prerendering and cache components.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center text-sm text-gray-500">
          <p>
            Demo project showcasing Next.js 16 Cache Components, Partial Prerendering,
            and Server Actions
          </p>
        </div>
      </div>
    </div>
  )
}
