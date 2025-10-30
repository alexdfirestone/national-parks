/**
 * Seed script for National Park categories
 * Run with: npx tsx scripts/seed-categories.ts
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const categories = [
  {
    name: 'Wildlife',
    description: 'Observing and learning about the diverse animal species in the park.',
  },
  {
    name: 'Hiking',
    description: 'Exploring trails ranging from easy walks to challenging backcountry routes.',
  },
  {
    name: 'Photography',
    description: 'Capturing the natural beauty and unique features of the park.',
  },
  {
    name: 'Camping',
    description: 'Staying overnight in designated campgrounds or backcountry sites.',
  },
  {
    name: 'Waterfalls',
    description: 'Visiting and enjoying the scenic waterfalls within the park.',
  },
  {
    name: 'Scenic Views',
    description: 'Taking in breathtaking vistas and panoramic views of the landscape.',
  },
  {
    name: 'Rock Climbing',
    description: 'Scaling cliffs and rock formations with proper safety equipment.',
  },
  {
    name: 'Fishing',
    description: 'Catching fish in rivers, lakes, and streams within the park.',
  },
  {
    name: 'Kayaking',
    description: 'Paddling through waterways and exploring lakes and rivers.',
  },
  {
    name: 'Stargazing',
    description: 'Observing the night sky and celestial objects in dark sky areas.',
  },
  {
    name: 'Food & Dining',
    description: 'Restaurants, picnic areas, and dining experiences in and around the park.',
  },
  {
    name: 'Lodging',
    description: 'Hotels, lodges, cabins, and other places to stay near the park.',
  },
  {
    name: 'Campsites',
    description: 'RV sites, tent camping areas, and campground amenities.',
  },
  {
    name: 'Winter Sports',
    description: 'Skiing, snowshoeing, and other winter recreational activities.',
  },
  {
    name: 'Biking',
    description: 'Mountain biking and cycling trails throughout the park.',
  },
  {
    name: 'Horseback Riding',
    description: 'Exploring trails on horseback through scenic landscapes.',
  },
  {
    name: 'Geology',
    description: 'Learning about unique rock formations, minerals, and geological features.',
  },
  {
    name: 'History & Culture',
    description: 'Historical sites, archaeological ruins, and cultural landmarks.',
  },
  {
    name: 'Water Sports',
    description: 'Swimming, rafting, canoeing, and other water-based activities.',
  },
  {
    name: 'Flora',
    description: 'Discovering diverse plant life, wildflowers, and forest ecosystems.',
  },
]

async function seedCategories() {
  console.log('🌲 Starting category seeding...\n')

  for (const category of categories) {
    try {
      const doc = await client.create({
        _type: 'category',
        name: category.name,
        slug: {
          _type: 'slug',
          current: category.name.toLowerCase().replace(/\s+/g, '-'),
        },
      })
      console.log(`✅ Created category: ${category.name}`)
    } catch (error) {
      console.error(`❌ Error creating category ${category.name}:`, error)
    }
  }

  console.log('\n🎉 Category seeding complete!')
}

seedCategories()

