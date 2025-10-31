import { voteThing } from '@/app/actions'
import { getVotesForThing } from '@/lib/db/queries'

export async function Votes({ thingId }: { thingId: number }) {
  const votes = await getVotesForThing(thingId)

  return (
    <div className="flex items-center gap-4">
      <form action={voteThing}>
        <input type="hidden" name="thingId" value={thingId} />
        <input type="hidden" name="value" value="1" />
        <button
          type="submit"
          className="p-3 border-2 border-black hover:bg-[#1E7B4D] hover:border-[#1E7B4D] hover:text-white transition-all"
          aria-label="Upvote"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      </form>

      <div className="flex flex-col items-center min-w-[80px] border-2 border-black px-4 py-3">
        <span className="text-3xl font-bold text-black font-mono">{votes.total}</span>
        <span className="text-xs font-mono uppercase tracking-wider text-gray-600">
          {votes.upvotes}↑ {votes.downvotes}↓
        </span>
      </div>

      <form action={voteThing}>
        <input type="hidden" name="thingId" value={thingId} />
        <input type="hidden" name="value" value="-1" />
        <button
          type="submit"
          className="p-3 border-2 border-black hover:bg-black hover:text-white transition-all"
          aria-label="Downvote"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </form>
    </div>
  )
}

