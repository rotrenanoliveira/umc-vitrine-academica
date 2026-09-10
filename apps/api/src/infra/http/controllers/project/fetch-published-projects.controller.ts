import type { FastifyReply } from 'fastify'
import type { FetchPublishedProjectsUseCase } from '@/domain/project/application/use-cases/fetch-published-projects'
import { ProjectPresenter } from '../../presenters/project-presenter'

interface FetchPublishedProjectsQuery {
  date?: Date
}

export class FetchPublishedProjectsController {
  constructor(private readonly fetchPublishedProjects: FetchPublishedProjectsUseCase) {}

  async handle({ date }: FetchPublishedProjectsQuery, reply: FastifyReply) {
    const result = await this.fetchPublishedProjects.execute({ date })

    return reply.status(200).send({
      projects: result.value.projects.map(ProjectPresenter.toHTTP),
    })
  }
}
