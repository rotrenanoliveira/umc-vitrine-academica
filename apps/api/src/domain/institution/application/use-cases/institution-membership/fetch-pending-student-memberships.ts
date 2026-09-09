import { type Either, left, right } from '@/core/either'
import {
  type InstitutionMember,
  InstitutionMemberStatus,
  InstitutionMemberType,
} from '../../../enterprise/entities/institution-member'
import { InstitutionNotFoundError } from '../../_errors/institution-not-found-error'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { canManageInstitution } from '../../authorization/can-manage-institution'
import type { InstitutionMembersRepository } from '../../repositories/institution-members-repository'
import type { InstitutionsRepository } from '../../repositories/institutions-repository'

interface FetchPendingStudentMembershipsRequest {
  actorId: string
  institutionId: string
}

type FetchPendingStudentMembershipsResponse = Either<
  InstitutionNotFoundError | UnauthorizedError,
  { members: InstitutionMember[] }
>

export class FetchPendingStudentMembershipsUseCase {
  constructor(
    private readonly institutionsRepository: InstitutionsRepository,
    private readonly membersRepository: InstitutionMembersRepository,
  ) {}

  async execute({
    actorId,
    institutionId,
  }: FetchPendingStudentMembershipsRequest): Promise<FetchPendingStudentMembershipsResponse> {
    const institution = await this.institutionsRepository.findById(institutionId)

    if (!institution) {
      return left(new InstitutionNotFoundError())
    }

    const userCanManageInstitution = await canManageInstitution(
      this.membersRepository,
      actorId,
      institutionId,
    )

    if (!userCanManageInstitution) {
      return left(new UnauthorizedError())
    }

    const members = await this.membersRepository.findManyByInstitutionTypeAndStatus(
      institutionId,
      InstitutionMemberType.STUDENT,
      InstitutionMemberStatus.PENDING,
    )

    return right({ members })
  }
}
