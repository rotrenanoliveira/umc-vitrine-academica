import { type Either, left, right } from '@/core/either'
import {
  type InstitutionMember,
  type InstitutionMemberStatus,
  InstitutionMemberType,
} from '../../../enterprise/entities/institution-member'
import { InstitutionMemberNotFoundError } from '../../_errors/institution-member-not-found-error'
import { InstitutionMemberRoleMismatchError } from '../../_errors/institution-member-role-mismatch-errors'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { canManageInstitution } from '../../authorization/can-manage-institution'
import type { InstitutionMembersRepository } from '../../repositories/institution-members-repository'

type RemoveProfessorStatusParams =
  | InstitutionMemberStatus.INACTIVE
  | InstitutionMemberStatus.FINISHED
  | InstitutionMemberStatus.SUSPENDED

interface RemoveProfessorFromInstitutionRequest {
  memberId: string
  status: RemoveProfessorStatusParams
  actorId: string
}

type RemoveProfessorFromInstitutionResponse = Either<
  InstitutionMemberNotFoundError | InstitutionMemberRoleMismatchError | UnauthorizedError,
  { member: InstitutionMember }
>

export class RemoveProfessorFromInstitutionUseCase {
  constructor(private readonly membersRepository: InstitutionMembersRepository) {}

  async execute({
    memberId,
    status,
    actorId,
  }: RemoveProfessorFromInstitutionRequest): Promise<RemoveProfessorFromInstitutionResponse> {
    const member = await this.membersRepository.findById(memberId)

    if (!member) {
      return left(new InstitutionMemberNotFoundError())
    }

    if (member.type !== InstitutionMemberType.PROFESSOR) {
      return left(new InstitutionMemberRoleMismatchError())
    }

    const canUserManageInstitution = await canManageInstitution(
      this.membersRepository,
      actorId,
      member.institutionId.toString(),
    )

    if (!canUserManageInstitution) {
      return left(new UnauthorizedError())
    }

    member.status = status

    await this.membersRepository.save(member)

    return right({
      member,
    })
  }
}
