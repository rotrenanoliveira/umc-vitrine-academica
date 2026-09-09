import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Slug } from '@/core/entities/value-objects/slug'
import {
  Institution,
  InstitutionOrigin,
  type InstitutionProps,
  InstitutionType,
} from '@/domain/institution/enterprise/entities/institution'
import {
  InstitutionMember,
  type InstitutionMemberProps,
  InstitutionMemberType,
} from '@/domain/institution/enterprise/entities/institution-member'
import {
  InstitutionSettings,
  type InstitutionSettingsProps,
} from '@/domain/institution/enterprise/entities/institution-settings'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionMapper } from '@/infra/database/drizzle/mappers/drizzle-institution-mapper'
import { DrizzleInstitutionMemberMapper } from '@/infra/database/drizzle/mappers/drizzle-institution-member-mapper'
import { DrizzleInstitutionSettingsMapper } from '@/infra/database/drizzle/mappers/drizzle-institution-settings-mapper'
import { institutionMembers, institutionSettings, institutions } from '@/infra/database/drizzle/schemas'

export function makeInstitution(override: Partial<InstitutionProps> = {}, id?: UniqueEntityId) {
  const institutionName = override.name ?? faker.company.name()
  const institutionSlug = override.slug ?? Slug.createFromText(institutionName)

  const institution = Institution.create(
    {
      name: institutionName,
      slug: institutionSlug,
      type: InstitutionType.UNIVERSITY,
      origin: InstitutionOrigin.ADMIN,
      description: faker.lorem.sentence(),
      registerBy: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return { institution }
}

export async function makeInstitutionOnDatabase(override: Partial<InstitutionProps> = {}, id?: UniqueEntityId) {
  const { institution } = makeInstitution(override, id)

  await db.insert(institutions).values(DrizzleInstitutionMapper.toPersistence(institution))

  return { institution }
}

export function makeInstitutionSettings(override: Partial<InstitutionSettingsProps> = {}, id?: UniqueEntityId) {
  return InstitutionSettings.create(
    {
      institutionId: new UniqueEntityId(),
      shouldProof: false,
      shouldVerify: false,
      ...override,
    },
    id,
  )
}

export async function makeInstitutionSettingsOnDatabase(
  override: Partial<InstitutionSettingsProps> = {},
  id?: UniqueEntityId,
) {
  const settings = makeInstitutionSettings(override, id)

  await db.insert(institutionSettings).values(DrizzleInstitutionSettingsMapper.toPersistence(settings))

  return { settings }
}

export function makeInstitutionMember(override: Partial<InstitutionMemberProps> = {}, id?: UniqueEntityId) {
  return InstitutionMember.create(
    {
      userId: new UniqueEntityId(),
      institutionId: new UniqueEntityId(),
      type: InstitutionMemberType.STUDENT,
      ...override,
    },
    id,
  )
}

export async function makeInstitutionMemberOnDatabase(
  override: Partial<InstitutionMemberProps> = {},
  id?: UniqueEntityId,
) {
  const member = makeInstitutionMember(override, id)

  await db.insert(institutionMembers).values(DrizzleInstitutionMemberMapper.toPersistence(member))

  return { member }
}
