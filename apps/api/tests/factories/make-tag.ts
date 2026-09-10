import { faker } from '@faker-js/faker'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Slug } from '@/core/entities/value-objects/slug'
import { Tag, type TagProps } from '@/domain/tag/enterprise/entities/tag'

export function makeTag(override: Partial<TagProps> = {}, id?: UniqueEntityId) {
  const name = override.name ?? faker.lorem.words(2)

  const tag = Tag.create(
    {
      name,
      slug: Slug.createFromText(name),
      ...override,
    },
    id,
  )

  return { tag }
}
