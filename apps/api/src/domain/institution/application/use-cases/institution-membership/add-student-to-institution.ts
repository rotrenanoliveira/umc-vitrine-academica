import { type Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  InstitutionMember,
  InstitutionMemberStatus,
  InstitutionMemberType,
} from '../../../enterprise/entities/institution-member'
import { InstitutionNotFoundError } from '../../_errors/institution-not-found-error'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { UserAlreadyMemberOfInstitutionError } from '../../_errors/user-already-member-of-institution-error'
import { canManageInstitution } from '../../authorization/can-manage-institution'
import type { InstitutionMembersRepository } from '../../repositories/institution-members-repository'
import type { InstitutionsRepository } from '../../repositories/institutions-repository'

interface AddStudentToInstitutionRequest {
  institutionId: string
  userId: string
  actorId: string
}

type AddStudentToInstitutionResponse = Either<
  InstitutionNotFoundError | UserAlreadyMemberOfInstitutionError | UnauthorizedError,
  { member: InstitutionMember }
>

export class AddStudentToInstitutionUseCase {
  constructor(
    private readonly institutionsRepository: InstitutionsRepository,
    private readonly membersRepository: InstitutionMembersRepository,
  ) {}

  async execute({
    institutionId,
    userId,
    actorId,
  }: AddStudentToInstitutionRequest): Promise<AddStudentToInstitutionResponse> {
    const institution = await this.institutionsRepository.findById(institutionId)

    if (!institution) {
      return left(new InstitutionNotFoundError())
    }

    const userCanManageInstitution = await canManageInstitution(this.membersRepository, actorId, institutionId)

    if (!userCanManageInstitution) {
      return left(new UnauthorizedError())
    }

    const existing = await this.membersRepository.findByUserInstitutionAndType(
      userId,
      institutionId,
      InstitutionMemberType.STUDENT,
    )

    if (existing && existing.status !== InstitutionMemberStatus.FINISHED) {
      return left(new UserAlreadyMemberOfInstitutionError())
    }

    if (existing) {
      existing.status = InstitutionMemberStatus.ACTIVE
      await this.membersRepository.save(existing)

      return right({
        member: existing,
      })
    }

    const member = InstitutionMember.create({
      userId: new UniqueEntityId(userId),
      institutionId: new UniqueEntityId(institutionId),
      type: InstitutionMemberType.STUDENT,
    })

    await this.membersRepository.create(member)

    return right({
      member,
    })
  }
}
