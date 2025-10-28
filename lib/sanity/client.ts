import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../../sanity/env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: {
    enabled: false,
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://your-project.sanity.studio',
  },
})

