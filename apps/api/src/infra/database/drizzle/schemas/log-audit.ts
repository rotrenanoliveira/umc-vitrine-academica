import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

const logAuditTable = pgTable('logs_audit', {
  id: text().notNull().primaryKey(),
  madeBy: text('made_by').notNull(),
  madeAt: timestamp('made_at').notNull(),
  action: text().notNull(),
  resource: text().notNull(),
  resourceId: text('resource_id'),
  payload: text().notNull(),
})

export const logsAudit = logAuditTable
