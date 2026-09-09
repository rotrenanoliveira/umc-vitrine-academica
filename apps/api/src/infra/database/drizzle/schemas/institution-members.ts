import { index, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { institutions } from './institutions'
import { users } from './users'

export const institutionMemberTypeEnum = pgEnum('institution_member_type', [
  'STUDENT',
  'PROFESSOR',
  'TEACHER',
  'MANAGER',
  'ADMINISTRATIVE_OFFICE',
])

export const institutionMemberStatusEnum = pgEnum('institution_member_status', [
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'FINISHED',
  'PENDING',
  'REJECTED',
])

const institutionMembersTable = pgTable(
  'institution_members',
  {
    id: text().notNull().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    institutionId: text('institution_id')
      .notNull()
      .references(() => institutions.id),
    type: institutionMemberTypeEnum().notNull(),
    status: institutionMemberStatusEnum().notNull().default('ACTIVE'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  },
  (table) => [
    index('institution_members_user_idx').on(table.userId),
    index('institution_members_institution_idx').on(table.institutionId),
  ],
)

export const institutionMembers = institutionMembersTable
