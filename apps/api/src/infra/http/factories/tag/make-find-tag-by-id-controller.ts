import { FindTagByIdUseCase } from '@/domain/tag/application/use-cases/find-tag-by-id'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleTagsRepository } from '@/infra/database/repositories/drizzle-tags-repository'
import { FindTagByIdController } from '../../controllers/tag/find-tag-by-id.controller'

export function makeFindTagByIdController() {
  const tagsRepository = new DrizzleTagsRepository(db)
  const findTagByIdUseCase = new FindTagByIdUseCase(tagsRepository)

  return new FindTagByIdController(findTagByIdUseCase)
}
