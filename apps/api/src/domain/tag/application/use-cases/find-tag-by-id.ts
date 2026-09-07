import { type Either, left, right } from '@/core/either'
import type { Tag } from '../../enterprise/entities/tag'
import { TagNotFoundError } from '../_errors/tag-not-found-error'
import type { TagsRepository } from '../repositories/tags-repository'

interface FindTagByIdUseCaseRequest {
  id: string
}

type FetchTagsUseCaseResponse = Either<TagNotFoundError, { tag: Tag }>

export class FindTagByIdUseCase {
  constructor(private readonly tagsRepository: TagsRepository) {}

  async execute({ id }: FindTagByIdUseCaseRequest): Promise<FetchTagsUseCaseResponse> {
    const tag = await this.tagsRepository.findById(id)

    if (!tag) {
      return left(new TagNotFoundError(`Tag com id "${id}" não encontrado`))
    }

    return right({ tag })
  }
}
