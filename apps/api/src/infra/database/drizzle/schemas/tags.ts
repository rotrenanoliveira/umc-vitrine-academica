import { pgEnum, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core'

export const tagsStatusEnum = pgEnum('tags_status', ['ACTIVE', 'INACTIVE'])

const tagsTable = pgTable(
  'tags',
  {
    id: text().notNull().primaryKey(),
    name: text().notNull(),
    slug: text().notNull().unique(),
    status: tagsStatusEnum().notNull().default('ACTIVE'),
  },
  (table) => [uniqueIndex('tags_slug_idx').on(table.slug)],
)

export const tags = tagsTable
