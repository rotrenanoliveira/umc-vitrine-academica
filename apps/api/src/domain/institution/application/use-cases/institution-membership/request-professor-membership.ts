import { type Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InstitutionStatus } from '../../../enterprise/entities/institution'
import {
  InstitutionMember,
  InstitutionMemberStatus,
  InstitutionMemberType,
} from '../../../enterprise/entities/institution-member'
import { InstitutionNotFoundError } from '../../_errors/institution-not-found-error'
import type { InvalidInstitutionMemberTypeError } from '../../_errors/invalid-institution-member-type-error'
import { UserAlreadyMemberOfInstitutionError } from '../../_errors/user-already-member-of-institution-error'
import type { InstitutionMembersRepository } from '../../repositories/institution-members-repository'
import type { InstitutionSettingsRepository } from '../../repositories/institution-settings-repository'
import type { InstitutionsRepository } from '../../repositories/institutions-repository'

interface RequestProfessorMembershipRequest {
  institutionId: string
  userId: string
}

type RequestProfessorMembershipResponse = Either<
  InstitutionNotFoundError | UserAlreadyMemberOfInstitutionError | InvalidInstitutionMemberTypeError,
  { member: InstitutionMember }
>

function canReRequestMembership(status: InstitutionMemberStatus) {
  return status === InstitutionMemberStatus.FINISHED || status === InstitutionMemberStatus.REJECTED
}

export class RequestProfessorMembershipUseCase {
  constructor(
    private readonly institutionsRepository: InstitutionsRepository,
    private readonly settingsRepository: InstitutionSettingsRepository,
    private readonly membersRepository: InstitutionMembersRepository,
  ) {}

  async execute({
    institutionId,
    userId,
  }: RequestProfessorMembershipRequest): Promise<RequestProfessorMembershipResponse> {
    const institution = await this.institutionsRepository.findById(institutionId)

    if (!institution || institution.status !== InstitutionStatus.ACTIVE) {
      return left(new InstitutionNotFoundError())
    }

    const existing = await this.membersRepository.findByUserInstitutionAndType(
      userId,
      institutionId,
      InstitutionMemberType.PROFESSOR,
    )

    if (existing && !canReRequestMembership(existing.status)) {
      return left(new UserAlreadyMemberOfInstitutionError())
    }

    const settings = await this.settingsRepository.findByInstitutionId(institutionId)

    const status =
      settings?.shouldVerify || settings?.shouldProof
        ? InstitutionMemberStatus.PENDING
        : InstitutionMemberStatus.ACTIVE

    if (existing) {
      existing.status = status
      await this.membersRepository.save(existing)
      return right({ member: existing })
    }

    const member = InstitutionMember.create({
      userId: new UniqueEntityId(userId),
      institutionId: new UniqueEntityId(institutionId),
      type: InstitutionMemberType.PROFESSOR,
      status,
    })

    await this.membersRepository.create(member)

    return right({ member })
  }
}
