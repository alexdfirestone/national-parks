import { voteThing } from '@/app/actions'
import { getVotesForThing } from '@/lib/db/queries'

export async function Votes({ thingId }: { thingId: number }) {
  const votes = await getVotesForThing(thingId)

  return (
    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
      <form action={voteThing}>
        <input type="hidden" name="thingId" value={thingId} />
        <input type="hidden" name="value" value="1" />
        <button
          type="submit"
          className="p-2 text-green-600 hover:bg-green-100 rounded transition-colors"
          aria-label="Upvote"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      </form>

      <div className="flex flex-col items-center min-w-[60px]">
        <span className="text-2xl font-bold text-gray-900">{votes.total}</span>
        <span className="text-xs text-gray-500">
          {votes.upvotes}↑ {votes.downvotes}↓
        </span>
      </div>

      <form action={voteThing}>
        <input type="hidden" name="thingId" value={thingId} />
        <input type="hidden" name="value" value="-1" />
        <button
          type="submit"
          className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
          aria-label="Downvote"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </form>
    </div>
  )
}

