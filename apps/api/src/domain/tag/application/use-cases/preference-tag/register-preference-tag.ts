import { type Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UserNotFoundError } from '@/domain/identity/application/_errors/user-not-found-error'
import type { UsersRepository } from '@/domain/identity/application/repositories/users-repository'
import { PreferenceTag } from '../../../enterprise/entities/preference-tag'
import { PreferenceTagAlreadyExistsError } from '../../_errors/preference-tag-already-exists-error'
import { TagNotFoundError } from '../../_errors/tag-not-found-error'
import type { PreferenceTagsRepository } from '../../repositories/preference-tags-repository'
import type { TagsRepository } from '../../repositories/tags-repository'

interface RegisterPreferenceTagUseCaseRequest {
  userId: string
  tagId: string
}

type RegisterPreferenceTagUseCaseResponse = Either<
  UserNotFoundError | TagNotFoundError | PreferenceTagAlreadyExistsError,
  { preferenceTag: PreferenceTag }
>

export class RegisterPreferenceTagUseCase {
  constructor(
    private readonly preferenceTagsRepository: PreferenceTagsRepository,
    private readonly tagsRepository: TagsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({ userId, tagId }: RegisterPreferenceTagUseCaseRequest): Promise<RegisterPreferenceTagUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new UserNotFoundError())
    }

    const tag = await this.tagsRepository.findById(tagId)

    if (!tag) {
      return left(new TagNotFoundError())
    }

    const preferenceTagAlreadyExists = await this.preferenceTagsRepository.findByUserIdAndTagId(userId, tagId)

    if (preferenceTagAlreadyExists) {
      return left(new PreferenceTagAlreadyExistsError())
    }

    const preferenceTag = PreferenceTag.create({
      userId: new UniqueEntityId(userId),
      tagId: new UniqueEntityId(tagId),
    })

    await this.preferenceTagsRepository.create(preferenceTag)

    return right({ preferenceTag })
  }
}
