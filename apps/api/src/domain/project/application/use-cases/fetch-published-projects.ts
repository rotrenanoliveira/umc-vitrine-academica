import { type Either, right } from '@/core/either'
import { type Project, ProjectStatus } from '../../enterprise/entities/project'
import type { ProjectScheduledRepository } from '../repositories/project-scheduled-repository'
import type { ProjectsRepository } from '../repositories/projects-repositories'

interface FetchPublishedProjectsUseCaseRequest {
  date?: Date
}

type FetchPublishedProjectsUseCaseResponse = Either<never, { projects: Project[] }>

export class FetchPublishedProjectsUseCase {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly projectScheduledRepository: ProjectScheduledRepository,
  ) {}

  async execute({
    date = new Date(),
  }: FetchPublishedProjectsUseCaseRequest = {}): Promise<FetchPublishedProjectsUseCaseResponse> {
    const schedules = await this.projectScheduledRepository.findManyReadyToPublish(date)
    const projects: Project[] = []

    for (const schedule of schedules) {
      const project = await this.projectsRepository.findById(schedule.projectId.toString())

      if (!project) {
        continue
      }

      if (project.status !== ProjectStatus.PUBLISHED) {
        continue
      }

      projects.push(project)
    }

    return right({ projects })
  }
}
