import { makeProject } from '@tests/factories/make-project'
import { makeProjectScheduled } from '@tests/factories/make-project-scheduled'
import { InMemoryProjectScheduledRepository } from '@tests/repositories/in-memory-project-scheduled-repository'
import { InMemoryProjectsRepository } from '@tests/repositories/in-memory-projects-repository'
import { ProjectStatus } from '../../../enterprise/entities/project'
import { InvalidProjectStatusError } from '../../_errors/invalid-project-status-error'
import { ProjectAlreadyScheduledError } from '../../_errors/project-already-scheduled-error'
import { ProjectNotFoundError } from '../../_errors/project-not-found-error'
import { ScheduleProjectUseCase } from './schedule-project'

let projectsRepository: InMemoryProjectsRepository
let projectScheduledRepository: InMemoryProjectScheduledRepository
let sut: ScheduleProjectUseCase

describe('(UC) - Schedule Project', () => {
  beforeEach(() => {
    projectsRepository = new InMemoryProjectsRepository()
    projectScheduledRepository = new InMemoryProjectScheduledRepository()
    sut = new ScheduleProjectUseCase(projectsRepository, projectScheduledRepository)
  })

  it('should able to schedule a project', async () => {
    const { project } = makeProject()
    projectsRepository.items.push(project)

    const publishedIn = new Date('2026-09-10T12:00:00.000Z')

    const result = await sut.execute({
      projectId: project.id.toString(),
      publishedIn,
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.projectScheduled.projectId.toString()).toBe(project.id.toString())
      expect(result.value.projectScheduled.publishedIn).toEqual(publishedIn)
      expect(project.status).toBe(ProjectStatus.SCHEDULED)
      expect(projectScheduledRepository.items).toHaveLength(1)
    }
  })

  it('should not be able to schedule a project that does not exist', async () => {
    const result = await sut.execute({
      projectId: 'non-existent-project',
      publishedIn: new Date(),
    })

    expect(result.isLeft()).toBeTruthy()

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ProjectNotFoundError)
    }
  })

  it('should not be able to schedule a project that is not a sketch', async () => {
    const { project } = makeProject({ status: ProjectStatus.PUBLISHED })
    projectsRepository.items.push(project)

    const result = await sut.execute({
      projectId: project.id.toString(),
      publishedIn: new Date(),
    })

    expect(result.isLeft()).toBeTruthy()

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidProjectStatusError)
    }
  })

  it('should not be able to schedule a project that is already scheduled', async () => {
    const { project } = makeProject({ status: ProjectStatus.SKETCH })
    projectsRepository.items.push(project)

    const { projectScheduled } = makeProjectScheduled({ projectId: project.id })
    projectScheduledRepository.items.push(projectScheduled)

    const result = await sut.execute({
      projectId: project.id.toString(),
      publishedIn: new Date(),
    })

    expect(result.isLeft()).toBeTruthy()

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ProjectAlreadyScheduledError)
    }
  })
})
