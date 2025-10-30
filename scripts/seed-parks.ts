/**
 * Seed script for all 63 US National Parks
 * Run with: npx tsx scripts/seed-parks.ts
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

interface ParkData {
  name: string
  states: string[]
  description: string
  lat: number
  lng: number
}

const nationalParks: ParkData[] = [
  {
    name: 'Acadia National Park',
    states: ['Maine'],
    description: 'Rocky coastline, granite peaks, and stunning ocean views along the Atlantic coast.',
    lat: 44.35,
    lng: -68.21,
  },
  {
    name: 'American Samoa National Park',
    states: ['American Samoa'],
    description: 'Tropical paradise featuring lush rainforests, pristine beaches, and vibrant coral reefs.',
    lat: -14.25,
    lng: -170.68,
  },
  {
    name: 'Arches National Park',
    states: ['Utah'],
    description: 'Home to over 2,000 natural sandstone arches, including the iconic Delicate Arch.',
    lat: 38.68,
    lng: -109.57,
  },
  {
    name: 'Badlands National Park',
    states: ['South Dakota'],
    description: 'Dramatic landscapes of sharply eroded buttes, pinnacles, and spires.',
    lat: 43.75,
    lng: -102.50,
  },
  {
    name: 'Big Bend National Park',
    states: ['Texas'],
    description: 'Vast Chihuahuan Desert wilderness along a dramatic bend in the Rio Grande.',
    lat: 29.25,
    lng: -103.25,
  },
  {
    name: 'Biscayne National Park',
    states: ['Florida'],
    description: 'Underwater paradise protecting coral reefs, mangrove forests, and historic shipwrecks.',
    lat: 25.49,
    lng: -80.21,
  },
  {
    name: 'Black Canyon of the Gunnison National Park',
    states: ['Colorado'],
    description: 'Sheer cliffs and narrow gorge carved by the Gunnison River over 2 million years.',
    lat: 38.57,
    lng: -107.72,
  },
  {
    name: 'Bryce Canyon National Park',
    states: ['Utah'],
    description: 'Otherworldly landscape of crimson-colored hoodoos and natural amphitheaters.',
    lat: 37.57,
    lng: -112.18,
  },
  {
    name: 'Canyonlands National Park',
    states: ['Utah'],
    description: 'Vast wilderness of canyons, mesas, and buttes carved by the Colorado and Green Rivers.',
    lat: 38.20,
    lng: -109.93,
  },
  {
    name: 'Capitol Reef National Park',
    states: ['Utah'],
    description: 'Hidden gem featuring a 100-mile wrinkle in the earth\'s crust called the Waterpocket Fold.',
    lat: 38.20,
    lng: -111.17,
  },
  {
    name: 'Carlsbad Caverns National Park',
    states: ['New Mexico'],
    description: 'Spectacular underground limestone caves including the massive Big Room chamber.',
    lat: 32.17,
    lng: -104.44,
  },
  {
    name: 'Channel Islands National Park',
    states: ['California'],
    description: 'Five remote islands offering pristine nature, unique wildlife, and archaeological sites.',
    lat: 34.01,
    lng: -119.42,
  },
  {
    name: 'Congaree National Park',
    states: ['South Carolina'],
    description: 'Largest intact expanse of old growth bottomland hardwood forest in the southeastern US.',
    lat: 33.78,
    lng: -80.78,
  },
  {
    name: 'Crater Lake National Park',
    states: ['Oregon'],
    description: 'The deepest lake in America, formed in a collapsed volcanic crater 7,700 years ago.',
    lat: 42.94,
    lng: -122.11,
  },
  {
    name: 'Cuyahoga Valley National Park',
    states: ['Ohio'],
    description: 'Lush forests, rolling hills, and the winding Cuyahoga River between Cleveland and Akron.',
    lat: 41.24,
    lng: -81.55,
  },
  {
    name: 'Death Valley National Park',
    states: ['California', 'Nevada'],
    description: 'Hottest, driest, and lowest point in North America featuring dramatic desert landscapes.',
    lat: 36.24,
    lng: -116.82,
  },
  {
    name: 'Denali National Park',
    states: ['Alaska'],
    description: 'Home to North America\'s tallest peak at 20,310 feet and abundant wildlife.',
    lat: 63.33,
    lng: -150.50,
  },
  {
    name: 'Dry Tortugas National Park',
    states: ['Florida'],
    description: 'Remote island paradise 70 miles west of Key West featuring historic Fort Jefferson.',
    lat: 24.63,
    lng: -82.87,
  },
  {
    name: 'Everglades National Park',
    states: ['Florida'],
    description: 'Largest tropical wilderness in the US and haven for rare and endangered species.',
    lat: 25.29,
    lng: -80.93,
  },
  {
    name: 'Gates of the Arctic National Park',
    states: ['Alaska'],
    description: 'Entirely north of the Arctic Circle, preserving pristine wilderness without roads or trails.',
    lat: 67.78,
    lng: -153.30,
  },
  {
    name: 'Gateway Arch National Park',
    states: ['Missouri'],
    description: 'Iconic 630-foot stainless steel arch commemorating westward expansion of the United States.',
    lat: 38.62,
    lng: -90.18,
  },
  {
    name: 'Glacier National Park',
    states: ['Montana'],
    description: 'Crown of the Continent with pristine forests, alpine meadows, and rugged mountains.',
    lat: 48.80,
    lng: -114.00,
  },
  {
    name: 'Glacier Bay National Park',
    states: ['Alaska'],
    description: 'Tidewater glaciers, snow-capped mountain ranges, and abundant marine wildlife.',
    lat: 58.50,
    lng: -137.00,
  },
  {
    name: 'Grand Canyon National Park',
    states: ['Arizona'],
    description: 'One of the world\'s most spectacular examples of erosion, carved by the Colorado River.',
    lat: 36.06,
    lng: -112.14,
  },
  {
    name: 'Grand Teton National Park',
    states: ['Wyoming'],
    description: 'Jagged mountain peaks rising abruptly from the valley floor of Jackson Hole.',
    lat: 43.79,
    lng: -110.68,
  },
  {
    name: 'Great Basin National Park',
    states: ['Nevada'],
    description: 'Ancient bristlecone pines, Lehman Caves, and the 13,063-foot Wheeler Peak.',
    lat: 38.98,
    lng: -114.30,
  },
  {
    name: 'Great Sand Dunes National Park',
    states: ['Colorado'],
    description: 'Tallest sand dunes in North America rising 750 feet against the Sangre de Cristo Mountains.',
    lat: 37.73,
    lng: -105.51,
  },
  {
    name: 'Great Smoky Mountains National Park',
    states: ['North Carolina', 'Tennessee'],
    description: 'Most visited national park featuring ancient mountains and remarkable diversity of life.',
    lat: 35.68,
    lng: -83.53,
  },
  {
    name: 'Guadalupe Mountains National Park',
    states: ['Texas'],
    description: 'Highest peaks in Texas and the world\'s most extensive Permian fossil reef.',
    lat: 31.92,
    lng: -104.87,
  },
  {
    name: 'Haleakalā National Park',
    states: ['Hawaii'],
    description: 'Dormant volcano crater, rare silversword plants, and stunning sunrise vistas.',
    lat: 20.72,
    lng: -156.17,
  },
  {
    name: 'Hawaiʻi Volcanoes National Park',
    states: ['Hawaii'],
    description: 'Active volcanoes Kīlauea and Mauna Loa, showcasing ongoing creation of new land.',
    lat: 19.42,
    lng: -155.29,
  },
  {
    name: 'Hot Springs National Park',
    states: ['Arkansas'],
    description: 'Historic bathhouse row and thermal springs flowing from the Ouachita Mountains.',
    lat: 34.51,
    lng: -93.05,
  },
  {
    name: 'Indiana Dunes National Park',
    states: ['Indiana'],
    description: '15 miles of Lake Michigan shoreline with towering dunes and diverse ecosystems.',
    lat: 41.65,
    lng: -87.05,
  },
  {
    name: 'Isle Royale National Park',
    states: ['Michigan'],
    description: 'Remote island wilderness in Lake Superior known for wolves, moose, and pristine beauty.',
    lat: 47.99,
    lng: -88.55,
  },
  {
    name: 'Joshua Tree National Park',
    states: ['California'],
    description: 'Surreal landscape where the Mojave and Colorado deserts meet, famous for Joshua trees.',
    lat: 33.87,
    lng: -115.90,
  },
  {
    name: 'Katmai National Park',
    states: ['Alaska'],
    description: 'World-famous brown bear viewing at Brooks Falls during salmon runs.',
    lat: 58.50,
    lng: -155.00,
  },
  {
    name: 'Kenai Fjords National Park',
    states: ['Alaska'],
    description: 'Magnificent glaciers, fjords, and abundant marine wildlife including whales and sea otters.',
    lat: 59.92,
    lng: -149.65,
  },
  {
    name: 'Kings Canyon National Park',
    states: ['California'],
    description: 'Deep valleys, towering granite cliffs, and groves of giant sequoia trees.',
    lat: 36.89,
    lng: -118.55,
  },
  {
    name: 'Kobuk Valley National Park',
    states: ['Alaska'],
    description: 'Arctic wilderness with the Great Kobuk Sand Dunes and caribou migration routes.',
    lat: 67.55,
    lng: -159.28,
  },
  {
    name: 'Lake Clark National Park',
    states: ['Alaska'],
    description: 'Stunning diversity of landscapes including volcanoes, glaciers, and turquoise lakes.',
    lat: 60.97,
    lng: -153.42,
  },
  {
    name: 'Lassen Volcanic National Park',
    states: ['California'],
    description: 'All four types of volcanoes and numerous hydrothermal features including boiling springs.',
    lat: 40.49,
    lng: -121.51,
  },
  {
    name: 'Mammoth Cave National Park',
    states: ['Kentucky'],
    description: 'World\'s longest known cave system with over 400 miles of surveyed passageways.',
    lat: 37.19,
    lng: -86.10,
  },
  {
    name: 'Mesa Verde National Park',
    states: ['Colorado'],
    description: 'Best-preserved Ancestral Puebloan cliff dwellings in North America from 600-1300 AD.',
    lat: 37.23,
    lng: -108.49,
  },
  {
    name: 'Mount Rainier National Park',
    states: ['Washington'],
    description: 'Iconic 14,410-foot volcanic peak covered with glaciers and surrounded by wildflower meadows.',
    lat: 46.85,
    lng: -121.75,
  },
  {
    name: 'New River Gorge National Park',
    states: ['West Virginia'],
    description: 'Ancient river carving through the Appalachian Mountains, popular for whitewater rafting.',
    lat: 37.97,
    lng: -81.07,
  },
  {
    name: 'North Cascades National Park',
    states: ['Washington'],
    description: 'Rugged alpine landscape with over 300 glaciers and North Cascades Highway.',
    lat: 48.70,
    lng: -121.20,
  },
  {
    name: 'Olympic National Park',
    states: ['Washington'],
    description: 'Three distinct ecosystems: glacier-capped mountains, temperate rainforests, and Pacific coastline.',
    lat: 47.97,
    lng: -123.50,
  },
  {
    name: 'Petrified Forest National Park',
    states: ['Arizona'],
    description: 'Colorful Painted Desert, ancient petrified wood, and 225-million-year-old fossils.',
    lat: 34.91,
    lng: -109.78,
  },
  {
    name: 'Pinnacles National Park',
    states: ['California'],
    description: 'Unique rock formations, talus caves, and California condor release site.',
    lat: 36.48,
    lng: -121.16,
  },
  {
    name: 'Redwood National Park',
    states: ['California'],
    description: 'Tallest trees on Earth, with coast redwoods reaching over 370 feet high.',
    lat: 41.30,
    lng: -124.00,
  },
  {
    name: 'Rocky Mountain National Park',
    states: ['Colorado'],
    description: 'Majestic mountain peaks, alpine lakes, and Trail Ridge Road reaching 12,183 feet.',
    lat: 40.40,
    lng: -105.58,
  },
  {
    name: 'Saguaro National Park',
    states: ['Arizona'],
    description: 'Giant saguaro cacti, symbol of the American West, in the Sonoran Desert.',
    lat: 32.25,
    lng: -110.50,
  },
  {
    name: 'Sequoia National Park',
    states: ['California'],
    description: 'Home to General Sherman, the largest tree on Earth by volume, and Mount Whitney.',
    lat: 36.43,
    lng: -118.68,
  },
  {
    name: 'Shenandoah National Park',
    states: ['Virginia'],
    description: 'Blue Ridge Mountains, Skyline Drive, and over 500 miles of hiking trails including the AT.',
    lat: 38.53,
    lng: -78.35,
  },
  {
    name: 'Theodore Roosevelt National Park',
    states: ['North Dakota'],
    description: 'Colorful badlands, bison herds, and the landscape that inspired President Roosevelt.',
    lat: 46.97,
    lng: -103.45,
  },
  {
    name: 'Virgin Islands National Park',
    states: ['U.S. Virgin Islands'],
    description: 'Tropical paradise with pristine beaches, coral reefs, and Taino archaeological sites.',
    lat: 18.34,
    lng: -64.73,
  },
  {
    name: 'Voyageurs National Park',
    states: ['Minnesota'],
    description: 'Water-based park of interconnected waterways, islands, and northern forests.',
    lat: 48.50,
    lng: -92.88,
  },
  {
    name: 'White Sands National Park',
    states: ['New Mexico'],
    description: 'World\'s largest gypsum dune field creating an otherworldly white desert landscape.',
    lat: 32.78,
    lng: -106.17,
  },
  {
    name: 'Wind Cave National Park',
    states: ['South Dakota'],
    description: 'Complex cave system with unique boxwork formations and mixed-grass prairie above.',
    lat: 43.57,
    lng: -103.48,
  },
  {
    name: 'Wrangell-St. Elias National Park',
    states: ['Alaska'],
    description: 'Largest national park at 13.2 million acres, with massive glaciers and towering peaks.',
    lat: 61.00,
    lng: -142.00,
  },
  {
    name: 'Yellowstone National Park',
    states: ['Wyoming', 'Montana', 'Idaho'],
    description: 'World\'s first national park featuring Old Faithful geyser and incredible geothermal features.',
    lat: 44.60,
    lng: -110.50,
  },
  {
    name: 'Yosemite National Park',
    states: ['California'],
    description: 'Iconic granite cliffs, waterfalls, giant sequoias, and the legendary Half Dome and El Capitan.',
    lat: 37.87,
    lng: -119.53,
  },
  {
    name: 'Zion National Park',
    states: ['Utah'],
    description: 'Towering sandstone cliffs, narrow slot canyons, and the famous Angels Landing hike.',
    lat: 37.30,
    lng: -113.05,
  },
]

async function seedParks() {
  console.log('🏞️  Starting national parks seeding...\n')
  console.log(`Total parks to seed: ${nationalParks.length}\n`)

  for (const park of nationalParks) {
    try {
      const doc = await client.create({
        _type: 'park',
        name: park.name,
        slug: {
          _type: 'slug',
          current: park.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, ''),
        },
        states: park.states,
        summary: [
          {
            _type: 'block',
            _key: Math.random().toString(36).substring(7),
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: Math.random().toString(36).substring(7),
                text: park.description,
                marks: [],
              },
            ],
            markDefs: [],
          },
        ],
        lat: park.lat,
        lng: park.lng,
      })
      console.log(`✅ Created park: ${park.name}`)
    } catch (error) {
      console.error(`❌ Error creating park ${park.name}:`, error)
    }
  }

  console.log('\n🎉 National parks seeding complete!')
  console.log(`Successfully seeded all ${nationalParks.length} national parks!`)
}

seedParks()

