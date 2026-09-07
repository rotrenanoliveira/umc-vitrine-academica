import { UpdateTagUseCase } from '@/domain/tag/application/use-cases/update-tag'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleTagsRepository } from '@/infra/database/repositories/drizzle-tags-repository'
import { UpdateTagController } from '../../controllers/tag/update-tag.controller'

export function makeUpdateTagController() {
  const tagsRepository = new DrizzleTagsRepository(db)
  const updateTagUseCase = new UpdateTagUseCase(tagsRepository)

  return new UpdateTagController(updateTagUseCase)
}
