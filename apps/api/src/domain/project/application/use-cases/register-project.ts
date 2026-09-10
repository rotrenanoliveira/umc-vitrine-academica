import { type Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Project } from '../../enterprise/entities/project'
import type { ProjectsRepository } from '../repositories/projects-repositories'

interface RegisterProjectUseCaseRequest {
  title: string
  description: string
  authorId: string
  attachments?: string[]
  tags?: string[]
}

type RegisterProjectUseCaseResponse = Either<never, { project: Project }>

export class RegisterProjectUseCase {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async execute({
    title,
    description,
    authorId,
    attachments,
    tags,
  }: RegisterProjectUseCaseRequest): Promise<RegisterProjectUseCaseResponse> {
    const project = Project.create({
      title,
      description,
      author: new UniqueEntityId(authorId),
      attachments,
      tags,
    })

    await this.projectsRepository.create(project)

    return right({ project })
  }
}
