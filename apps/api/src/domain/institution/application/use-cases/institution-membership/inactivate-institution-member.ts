import { type Either, left, right } from '@/core/either'
import { type InstitutionMember, InstitutionMemberStatus } from '../../../enterprise/entities/institution-member'
import { InstitutionMemberNotFoundError } from '../../_errors/institution-member-not-found-error'
import type { InvalidInstitutionMemberStatusError } from '../../_errors/invalid-institution-member-status-error'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { canManageInstitution } from '../../authorization/can-manage-institution'
import type { InstitutionMembersRepository } from '../../repositories/institution-members-repository'

interface InactivateInstitutionMemberRequest {
  memberId: string
  actorId: string
}

type InactivateInstitutionMemberResponse = Either<
  InstitutionMemberNotFoundError | InvalidInstitutionMemberStatusError | UnauthorizedError,
  { member: InstitutionMember }
>

export class InactivateInstitutionMemberUseCase {
  constructor(private readonly membersRepository: InstitutionMembersRepository) {}

  async execute({
    memberId,
    actorId,
  }: InactivateInstitutionMemberRequest): Promise<InactivateInstitutionMemberResponse> {
    const member = await this.membersRepository.findById(memberId)

    if (!member) {
      return left(new InstitutionMemberNotFoundError())
    }

    const canUserManageInstitution = await canManageInstitution(
      this.membersRepository,
      actorId,
      member.institutionId.toString(),
    )

    if (!canUserManageInstitution) {
      return left(new UnauthorizedError())
    }

    member.status = InstitutionMemberStatus.INACTIVE

    await this.membersRepository.save(member)

    return right({
      member,
    })
  }
}
