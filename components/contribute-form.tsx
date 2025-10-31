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
    <form action={handleSubmit} className="space-y-6">
      {/* Hidden fields for user info (in real app, would come from auth) */}
      <input type="hidden" name="userName" value={userName} />
      <input type="hidden" name="userProviderId" value={userProviderId} />

      <div>
        <label htmlFor="parkId" className="block text-xs font-mono uppercase tracking-wider text-black mb-2">
          Park *
        </label>
        <select
          id="parkId"
          name="parkId"
          required
          className="w-full px-4 py-3 border-2 border-black bg-white focus:border-[#1E7B4D] focus:outline-none transition-colors font-mono text-sm"
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
        <label htmlFor="categoryId" className="block text-xs font-mono uppercase tracking-wider text-black mb-2">
          Category *
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          className="w-full px-4 py-3 border-2 border-black bg-white focus:border-[#1E7B4D] focus:outline-none transition-colors font-mono text-sm"
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
        <label htmlFor="title" className="block text-xs font-mono uppercase tracking-wider text-black mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={200}
          className="w-full px-4 py-3 border-2 border-black bg-white focus:border-[#1E7B4D] focus:outline-none transition-colors"
          placeholder="What did you find?"
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-xs font-mono uppercase tracking-wider text-black mb-2">
          Description *
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={6}
          className="w-full px-4 py-3 border-2 border-black bg-white focus:border-[#1E7B4D] focus:outline-none transition-colors resize-none"
          placeholder="Share details about this thing..."
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-xs font-mono uppercase tracking-wider text-black mb-2">
          Image (optional)
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full px-4 py-3 border-2 border-black bg-white focus:border-[#1E7B4D] focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-mono file:uppercase file:tracking-wider file:bg-black file:text-white file:cursor-pointer hover:file:bg-[#1E7B4D]"
        />
        {imageFile && (
          <p className="mt-2 text-xs font-mono text-gray-600">
            Selected: {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-4 border-2 border-black bg-[#1E7B4D] text-white font-mono uppercase tracking-wider hover:bg-black disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Thing'}
      </button>
    </form>
  )
}

