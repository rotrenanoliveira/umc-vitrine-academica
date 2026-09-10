import { FetchPublishedProjectsUseCase } from '@/domain/project/application/use-cases/fetch-published-projects'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleProjectScheduledRepository } from '@/infra/database/repositories/drizzle-project-scheduled-repository'
import { DrizzleProjectsRepository } from '@/infra/database/repositories/drizzle-projects-repository'
import { FetchPublishedProjectsController } from '../../controllers/project/fetch-published-projects.controller'

export function makeFetchPublishedProjectsController() {
  const projectsRepository = new DrizzleProjectsRepository(db)
  const projectScheduledRepository = new DrizzleProjectScheduledRepository(db)
  const fetchPublishedProjectsUseCase = new FetchPublishedProjectsUseCase(
    projectsRepository,
    projectScheduledRepository,
  )

  return new FetchPublishedProjectsController(fetchPublishedProjectsUseCase)
}
