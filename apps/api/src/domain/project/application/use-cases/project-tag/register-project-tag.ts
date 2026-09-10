import { type Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ProjectTag } from '@/domain/project/enterprise/entities/project-tag'
import { TagNotFoundError } from '@/domain/tag/application/_errors/tag-not-found-error'
import type { TagsRepository } from '@/domain/tag/application/repositories/tags-repository'
import { ProjectNotFoundError } from '../../_errors/project-not-found-error'
import { ProjectTagAlreadyExistsError } from '../../_errors/project-tag-already-exists-error'
import type { ProjectTagsRepository } from '../../repositories/project-tags-repository'
import type { ProjectsRepository } from '../../repositories/projects-repositories'

interface RegisterProjectTagUseCaseRequest {
  projectId: string
  tagId: string
}

type RegisterProjectTagUseCaseResponse = Either<
  ProjectNotFoundError | TagNotFoundError | ProjectTagAlreadyExistsError,
  { projectTag: ProjectTag }
>

export class RegisterProjectTagUseCase {
  constructor(
    private readonly projectTagsRepository: ProjectTagsRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly tagsRepository: TagsRepository,
  ) {}

  async execute({ projectId, tagId }: RegisterProjectTagUseCaseRequest): Promise<RegisterProjectTagUseCaseResponse> {
    const project = await this.projectsRepository.findById(projectId)

    if (!project) {
      return left(new ProjectNotFoundError())
    }

    const tag = await this.tagsRepository.findById(tagId)

    if (!tag) {
      return left(new TagNotFoundError())
    }

    const projectTagAlreadyExists = await this.projectTagsRepository.findByProjectIdAndTagId(projectId, tagId)

    if (projectTagAlreadyExists) {
      return left(new ProjectTagAlreadyExistsError())
    }

    const projectTag = ProjectTag.create({
      projectId: new UniqueEntityId(projectId),
      tagId: new UniqueEntityId(tagId),
    })

    await this.projectTagsRepository.create(projectTag)

    return right({ projectTag })
  }
}
