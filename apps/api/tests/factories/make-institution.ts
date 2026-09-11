const { faker } = require('@faker-js/faker/locale/pt_BR')

import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UniqueEntityId as UniqueEntityIdClass } from '@/core/entities/unique-entity-id'
import { Slug } from '@/core/entities/value-objects/slug'
import {
  Institution,
  InstitutionOrigin,
  type InstitutionProps,
  InstitutionType,
} from '@/domain/institution/enterprise/entities/institutions'

export function makeInstitution(override: Partial<InstitutionProps> = {}, id?: UniqueEntityId) {
  const name = override.name ?? faker.company.name()

  const institution = Institution.create(
    {
      name,
      slug: override.slug ?? Slug.createFromText(name),
      type: InstitutionType.UNIVERSITY,
      origin: InstitutionOrigin.USER_REGISTRATION,
      description: faker.lorem.paragraph(),
      registerBy: new UniqueEntityIdClass(),
      shouldProof: false,
      shouldVerify: false,
      ...override,
    },
    id,
  )

  return { institution }
}
