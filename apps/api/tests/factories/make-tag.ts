import { faker } from '@faker-js/faker'
import { Slug } from '@/core/entities/value-objects/slug'
import { Tag, type TagProps } from '@/domain/tag/enterprise/entities/tag'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleTagMapper } from '@/infra/database/drizzle/mappers/drizzle-tag-mapper'
import { tags } from '@/infra/database/drizzle/schemas'

export function makeTag(overrides?: Partial<TagProps>) {
  const tagName = faker.lorem.words(3)

  const tag = Tag.create({
    name: tagName,
    slug: Slug.createFromText(tagName),
    status: 'ACTIVE',
    ...overrides,
  })

  return { tag }
}

export async function makeTagOnDatabase(overrides?: Partial<TagProps>) {
  const { tag } = makeTag(overrides)

  await db.insert(tags).values(DrizzleTagMapper.toPersistence(tag))

  return { tag }
}
