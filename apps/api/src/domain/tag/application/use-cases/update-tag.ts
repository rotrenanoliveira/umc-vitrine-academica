import { type Either, left, right } from '@/core/either'
import type { Tag } from '../../enterprise/entities/tag'
import { TagNotFoundError } from '../_errors/tag-not-found-error'
import type { TagsRepository } from '../repositories/tags-repository'

interface UpdateTagUseCaseRequest {
  id: string
  status: 'ACTIVE' | 'INACTIVE'
}

type UpdateTagUseCaseResponse = Either<TagNotFoundError, { tag: Tag }>

export class UpdateTagUseCase {
  constructor(private readonly tagsRepository: TagsRepository) {}

  async execute({ id, status }: UpdateTagUseCaseRequest): Promise<UpdateTagUseCaseResponse> {
    const tag = await this.tagsRepository.findById(id)

    if (!tag) {
      return left(new TagNotFoundError())
    }

    tag.status = status

    await this.tagsRepository.save(tag)

    return right({ tag })
  }
}
