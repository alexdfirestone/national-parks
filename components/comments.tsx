import { addComment } from '@/app/actions'
import { getCommentsForThing } from '@/lib/db/queries'

export async function Comments({ thingId }: { thingId: number }) {
  const comments = await getCommentsForThing(thingId)

  // Organize comments into parent and replies
  const parentComments = comments.filter((c) => !c.parentId)
  const commentMap = new Map(comments.map((c) => [c.id, c]))

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">
        Comments ({comments.length})
      </h3>

      <div className="space-y-4">
        {parentComments.map((comment) => {
          const replies = comments.filter((c) => c.parentId === comment.id)
          return (
            <div key={comment.id} className="space-y-3">
              <div className="border-l-2 border-blue-500 pl-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-medium text-gray-900">
                    {comment.author.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.body}</p>
              </div>

              {replies.length > 0 && (
                <div className="ml-8 space-y-2">
                  {replies.map((reply) => (
                    <div key={reply.id} className="border-l-2 border-gray-300 pl-4">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {reply.author.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{reply.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <form action={addComment} className="mt-6">
        <input type="hidden" name="thingId" value={thingId} />
        <div className="space-y-3">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-900">
            Add a comment
          </label>
          <textarea
            id="comment"
            name="body"
            rows={3}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share your thoughts..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Post Comment
          </button>
        </div>
      </form>
    </div>
  )
}

