import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'park',
  title: 'Park',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'states',
      title: 'States',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of states where this park is located',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text description of the park',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility',
        },
      ],
    }),
    defineField({
      name: 'lat',
      title: 'Latitude',
      type: 'number',
      description: 'Geographic latitude coordinate',
    }),
    defineField({
      name: 'lng',
      title: 'Longitude',
      type: 'number',
      description: 'Geographic longitude coordinate',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'heroImage',
      subtitle: 'states',
    },
    prepare(selection) {
      const { title, media, subtitle } = selection
      return {
        title,
        media,
        subtitle: subtitle ? subtitle.join(', ') : '',
      }
    },
  },
})

