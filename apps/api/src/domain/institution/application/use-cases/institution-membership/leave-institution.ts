import { type Either, left, right } from '@/core/either'
import { type InstitutionMember, InstitutionMemberStatus } from '../../../enterprise/entities/institution-member'
import { InstitutionMemberNotFoundError } from '../../_errors/institution-member-not-found-error'
import { InstitutionNotFoundError } from '../../_errors/institution-not-found-error'
import type { InstitutionMembersRepository } from '../../repositories/institution-members-repository'
import type { InstitutionsRepository } from '../../repositories/institutions-repository'

interface LeaveInstitutionRequest {
  institutionId: string
  userId: string
}

type LeaveInstitutionResponse = Either<InstitutionMemberNotFoundError, { member: InstitutionMember }>

export class LeaveInstitutionUseCase {
  constructor(
    private readonly institutionsRepository: InstitutionsRepository,
    private readonly membersRepository: InstitutionMembersRepository,
  ) {}

  async execute({ institutionId, userId }: LeaveInstitutionRequest): Promise<LeaveInstitutionResponse> {
    const institution = await this.institutionsRepository.findById(institutionId)

    if (!institution) {
      return left(new InstitutionNotFoundError())
    }

    const member = await this.membersRepository.findByUserAndInstitution(userId, institutionId)

    if (!member || member.userId.toString() !== userId || member.institutionId.toString() !== institutionId) {
      return left(new InstitutionMemberNotFoundError())
    }

    member.status = InstitutionMemberStatus.FINISHED

    await this.membersRepository.save(member)

    return right({
      member,
    })
  }
}
