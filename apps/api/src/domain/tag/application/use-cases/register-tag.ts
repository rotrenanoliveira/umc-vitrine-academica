import { type Either, left, right } from '@/core/either'
import { Tag } from '../../enterprise/entities/tag'
import { TagAlreadyExistsError } from '../_errors/tag-already-exists-error'
import type { TagsRepository } from '../repositories/tags-repository'

interface RegisterTagUseCaseRequest {
  name: string
}

type RegisterTagUseCaseResponse = Either<TagAlreadyExistsError, { tag: Tag }>

export class RegisterTagUseCase {
  constructor(private readonly tagsRepository: TagsRepository) {}

  async execute({ name }: RegisterTagUseCaseRequest): Promise<RegisterTagUseCaseResponse> {
    const tag = Tag.create({ name })

    const tagWithSameSlug = await this.tagsRepository.findBySlug(tag.slug.value)

    if (tagWithSameSlug) {
      return left(new TagAlreadyExistsError(`Tag com a slug "${tag.slug.value}" já existe`))
    }

    await this.tagsRepository.create(tag)

    return right({ tag })
  }
}
