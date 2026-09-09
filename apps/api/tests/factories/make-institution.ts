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

export function makeInstitution(override: Partial<InstitutionProps> = {}, id?: UniqueEntityId) {
  const institutionName = override.name ?? faker.company.name()
  const institutionSlug = Slug.createFromText(institutionName)

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
