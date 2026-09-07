import { FindTagBySlugUseCase } from '@/domain/tag/application/use-cases/find-tag-by-slug'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleTagsRepository } from '@/infra/database/repositories/drizzle-tags-repository'
import { FindTagBySlugController } from '../../controllers/tag/find-tag-by-slug.controller'

export function makeFindTagBySlugController() {
  const tagsRepository = new DrizzleTagsRepository(db)
  const findTagBySlugUseCase = new FindTagBySlugUseCase(tagsRepository)

  return new FindTagBySlugController(findTagBySlugUseCase)
}
