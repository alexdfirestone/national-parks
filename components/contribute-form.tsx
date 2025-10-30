'use client'

import { useState } from 'react'
import { createThing } from '@/app/actions'

interface ContributeFormProps {
  parks: Array<{ id: number; name: string; slug: string }>
  categories: Array<{ id: number; name: string; slug: string }>
  userName: string
  userProviderId: string
}

export function ContributeForm({
  parks,
  categories,
  userName,
  userProviderId,
}: ContributeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await createThing(formData)
      // Reset form on success
      setImageFile(null)
    } catch (error) {
      console.error('Error submitting:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Hidden fields for user info (in real app, would come from auth) */}
      <input type="hidden" name="userName" value={userName} />
      <input type="hidden" name="userProviderId" value={userProviderId} />

      <div>
        <label htmlFor="parkId" className="block text-sm font-medium text-gray-900 mb-2">
          Park *
        </label>
        <select
          id="parkId"
          name="parkId"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a park</option>
          {parks.map((park) => (
            <option key={park.id} value={park.id}>
              {park.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-900 mb-2">
          Category *
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="What did you discover?"
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-900 mb-2">
          Description *
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Share details about your discovery..."
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-900 mb-2">
          Image (optional)
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {imageFile && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Discovery'}
      </button>
    </form>
  )
}

