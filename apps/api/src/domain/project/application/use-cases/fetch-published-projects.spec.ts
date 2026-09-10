import { makeProject } from '@tests/factories/make-project'
import { makeProjectScheduled } from '@tests/factories/make-project-scheduled'
import { InMemoryProjectScheduledRepository } from '@tests/repositories/in-memory-project-scheduled-repository'
import { InMemoryProjectsRepository } from '@tests/repositories/in-memory-projects-repository'
import { ProjectStatus } from '../../enterprise/entities/project'
import { FetchPublishedProjectsUseCase } from './fetch-published-projects'

let projectsRepository: InMemoryProjectsRepository
let projectScheduledRepository: InMemoryProjectScheduledRepository
let sut: FetchPublishedProjectsUseCase

describe('(UC) - Fetch Published Projects', () => {
  beforeEach(() => {
    projectsRepository = new InMemoryProjectsRepository()
    projectScheduledRepository = new InMemoryProjectScheduledRepository()
    sut = new FetchPublishedProjectsUseCase(projectsRepository, projectScheduledRepository)
  })

  it('should able to list projects published on a given day', async () => {
    const today = new Date('2026-09-09T10:00:00.000Z')
    const anotherDay = new Date('2026-09-08T10:00:00.000Z')

    const { project: publishedToday } = makeProject({ status: ProjectStatus.PUBLISHED })
    const { project: scheduledToday } = makeProject({ status: ProjectStatus.SCHEDULED })
    const { project: publishedAnotherDay } = makeProject({ status: ProjectStatus.PUBLISHED })

    projectsRepository.items.push(publishedToday, scheduledToday, publishedAnotherDay)

    projectScheduledRepository.items.push(
      makeProjectScheduled({
        projectId: publishedToday.id,
        publishedIn: new Date('2026-09-09T08:00:00.000Z'),
      }).projectScheduled,
      makeProjectScheduled({
        projectId: scheduledToday.id,
        publishedIn: today,
      }).projectScheduled,
      makeProjectScheduled({
        projectId: publishedAnotherDay.id,
        publishedIn: anotherDay,
      }).projectScheduled,
    )

    const result = await sut.execute({ date: today })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.projects).toHaveLength(1)
      expect(result.value.projects[0].id.toString()).toBe(publishedToday.id.toString())
    }
  })
})
