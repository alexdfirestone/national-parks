import { addComment } from '@/app/actions'
import { getCommentsForThing } from '@/lib/db/queries'

export async function Comments({ thingId }: { thingId: number }) {
  const comments = await getCommentsForThing(thingId)

  // Organize comments into parent and replies
  const parentComments = comments.filter((c) => !c.parentId)
  const commentMap = new Map(comments.map((c) => [c.id, c]))

  return (
    <div className="space-y-6">
      <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tighter text-black pb-3 border-b-2 border-black">
        Comments ({comments.length})
      </h3>

      <div className="space-y-4">
        {parentComments.map((comment) => {
          const replies = comments.filter((c) => c.parentId === comment.id)
          return (
            <div key={comment.id} className="space-y-3">
              <div className="border-l-4 border-[#1E7B4D] pl-4 py-2">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-black">
                    {comment.author.name}
                  </span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className="text-xs font-mono text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">{comment.body}</p>
              </div>

              {replies.length > 0 && (
                <div className="ml-6 md:ml-8 space-y-2">
                  {replies.map((reply) => (
                    <div key={reply.id} className="border-l-2 border-gray-400 pl-4 py-2">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider text-black">
                          {reply.author.name}
                        </span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span className="text-xs font-mono text-gray-500">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-800 text-sm leading-relaxed">{reply.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <form action={addComment} className="mt-8 pt-6 border-t-2 border-black">
        <input type="hidden" name="thingId" value={thingId} />
        <div className="space-y-4">
          <label htmlFor="comment" className="block text-xs font-mono uppercase tracking-wider text-black">
            Add Comment
          </label>
          <textarea
            id="comment"
            name="body"
            rows={4}
            required
            className="w-full px-4 py-3 border-2 border-black bg-white focus:border-[#1E7B4D] focus:outline-none transition-colors resize-none"
            placeholder="Share your thoughts..."
          />
          <button
            type="submit"
            className="px-6 py-3 border-2 border-black bg-[#1E7B4D] text-white font-mono uppercase tracking-wider hover:bg-black transition-colors text-sm"
          >
            Post Comment
          </button>
        </div>
      </form>
    </div>
  )
}

