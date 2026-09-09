import { type Either, left, right } from '@/core/either'
import { type InstitutionMember, InstitutionMemberStatus } from '../../../enterprise/entities/institution-member'
import { InstitutionMemberNotFoundError } from '../../_errors/institution-member-not-found-error'
import type { InvalidInstitutionMemberStatusError } from '../../_errors/invalid-institution-member-status-error'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { canManageInstitution } from '../../authorization/can-manage-institution'
import type { InstitutionMembersRepository } from '../../repositories/institution-members-repository'

interface FinishInstitutionMemberRequest {
  memberId: string
  actorId: string
}

type FinishInstitutionMemberResponse = Either<
  InstitutionMemberNotFoundError | InvalidInstitutionMemberStatusError | UnauthorizedError,
  { member: InstitutionMember }
>

export class FinishInstitutionMemberUseCase {
  constructor(private readonly membersRepository: InstitutionMembersRepository) {}

  async execute({ memberId, actorId }: FinishInstitutionMemberRequest): Promise<FinishInstitutionMemberResponse> {
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

    member.status = InstitutionMemberStatus.FINISHED

    await this.membersRepository.save(member)

    return right({
      member,
    })
  }
}
