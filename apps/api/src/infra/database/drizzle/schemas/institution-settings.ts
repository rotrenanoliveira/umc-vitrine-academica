import { boolean, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { institutions } from './institutions'

const institutionSettingsTable = pgTable(
  'institution_settings',
  {
    id: text().notNull().primaryKey(),
    institutionId: text('institution_id')
      .notNull()
      .unique()
      .references(() => institutions.id),
    shouldProof: boolean('should_proof').notNull().default(false),
    shouldVerify: boolean('should_verify').notNull().default(false),
    domain: text(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex('institution_settings_institution_id_idx').on(table.institutionId)],
)

export const institutionSettings = institutionSettingsTable
