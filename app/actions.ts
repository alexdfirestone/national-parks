'use server'

import { revalidateTag, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { db, things, votes, comments, users, thingImages } from '@/db'
import { eq, and } from 'drizzle-orm'
import { put } from '@vercel/blob'
import { getParkIdBySlug } from '@/lib/db/queries'

// Helper to get or create a user (since we're not using auth yet)
async function getOrCreateUser(name: string, providerId: string) {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.providerId, providerId))
    .limit(1)

  if (existingUser.length > 0) {
    return existingUser[0]
  }

  const newUser = await db
    .insert(users)
    .values({
      providerId,
      displayName: name,
      roles: ['user'],
    })
    .returning()

  return newUser[0]
}

export async function createThing(formData: FormData) {
  const parkId = parseInt(formData.get('parkId') as string)
  const categoryId = parseInt(formData.get('categoryId') as string)
  const title = formData.get('title') as string
  const body = formData.get('body') as string
  const userName = formData.get('userName') as string
  const userProviderId = formData.get('userProviderId') as string
  const imageFile = formData.get('image') as File | null
  const returnTo = formData.get('returnTo') as string | null

  // Get or create user
  const user = await getOrCreateUser(userName, userProviderId)

  // Create the thing
  const [thing] = await db
    .insert(things)
    .values({
      parkId,
      categoryId,
      authorId: user.id,
      title,
      body,
      status: 'published', // Auto-publish for now (in real app, would be 'pending')
    })
    .returning()

  // Handle image upload if provided
  if (imageFile && imageFile.size > 0) {
    try {
      const blob = await put(`things/${thing.id}/${imageFile.name}`, imageFile, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })
      
      // Save image URL to database
      await db.insert(thingImages).values({
        thingId: thing.id,
        url: blob.url,
        alt: imageFile.name, // Use filename as alt text for now
      })
      
      console.log('Image uploaded:', blob.url)
    } catch (error) {
      console.error('Image upload failed:', error)
      // Continue anyway - the thing is still created
    }
  }

  // Get park slug for revalidation
  const parkData = await db.query.parks.findFirst({
    where: (parks, { eq }) => eq(parks.id, parkId),
  })

  if (parkData) {
    // Revalidate the park's things list (eventual consistency is fine here)
    revalidateTag(`park:${parkData.slug}:things`, 'max')
  }

  // Redirect back to where they came from, or to the park page as fallback
  redirect(returnTo || `/parks/${parkData?.slug}`)
}

export async function voteThing(formData: FormData) {
  const thingId = parseInt(formData.get('thingId') as string)
  const value = parseInt(formData.get('value') as string) as 1 | -1

  // For now, use a dummy user (in real app, would use session)
  const dummyUser = await getOrCreateUser('Guest User', 'guest-user-id')

  // Check if user already voted
  const existingVote = await db
    .select()
    .from(votes)
    .where(
      and(
        eq(votes.userId, dummyUser.id),
        eq(votes.subjectType, 'thing'),
        eq(votes.subjectId, thingId)
      )
    )
    .limit(1)

  if (existingVote.length > 0) {
    // Update existing vote
    await db
      .update(votes)
      .set({ value })
      .where(eq(votes.id, existingVote[0].id))
  } else {
    // Insert new vote
    await db.insert(votes).values({
      userId: dummyUser.id,
      subjectType: 'thing',
      subjectId: thingId,
      value,
    })
  }

  // Use updateTag for immediate refresh of vote counts
  updateTag(`thing:${thingId}:votes`)
}

export async function addComment(formData: FormData) {
  const thingId = parseInt(formData.get('thingId') as string)
  const body = formData.get('body') as string
  const parentId = formData.get('parentId')
    ? parseInt(formData.get('parentId') as string)
    : null

  // For now, use a dummy user (in real app, would use session)
  const dummyUser = await getOrCreateUser('Guest User', 'guest-user-id')

  // If replying to a comment, verify it's not a nested reply (max 1 level)
  if (parentId) {
    const parentComment = await db
      .select({ parentId: comments.parentId })
      .from(comments)
      .where(eq(comments.id, parentId))
      .limit(1)

    if (parentComment[0]?.parentId !== null) {
      throw new Error('Cannot reply to a reply - max 1 level of nesting')
    }
  }

  // Insert comment
  await db.insert(comments).values({
    thingId,
    authorId: dummyUser.id,
    parentId,
    body,
  })

  // Use updateTag for immediate refresh of comments
  updateTag(`thing:${thingId}:comments`)
}

