import { type Either, left, right } from '@/core/either'
import type { Tag } from '../../enterprise/entities/tag'
import { TagNotFoundError } from '../_errors/tag-not-found-error'
import type { TagsRepository } from '../repositories/tags-repository'

interface FindTagBySlugUseCaseRequest {
  slug: string
}

type FetchTagsUseCaseResponse = Either<TagNotFoundError, { tag: Tag }>

export class FindTagBySlugUseCase {
  constructor(private readonly tagsRepository: TagsRepository) {}

  async execute({ slug }: FindTagBySlugUseCaseRequest): Promise<FetchTagsUseCaseResponse> {
    const tag = await this.tagsRepository.findBySlug(slug)

    if (!tag) {
      return left(new TagNotFoundError(`Tag com slug "${slug}" não encontrado`))
    }

    return right({ tag })
  }
}
