import { type Either, left, right } from '@/core/either'
import { type Institution, InstitutionStatus } from '../../../enterprise/entities/institution'
import { InstitutionNotFoundError } from '../../_errors/institution-not-found-error'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { canManageInstitution } from '../../authorization/can-manage-institution'
import type { InstitutionMembersRepository } from '../../repositories/institution-members-repository'
import type { InstitutionsRepository } from '../../repositories/institutions-repository'

interface ActivateInstitutionRequest {
  institutionId: string
  actorId: string
}

type ActivateInstitutionResponse = Either<InstitutionNotFoundError | UnauthorizedError, { institution: Institution }>

export class ActivateInstitutionUseCase {
  constructor(
    private readonly institutionsRepository: InstitutionsRepository,
    private readonly membersRepository: InstitutionMembersRepository,
  ) {}

  async execute({ institutionId, actorId }: ActivateInstitutionRequest): Promise<ActivateInstitutionResponse> {
    const institution = await this.institutionsRepository.findById(institutionId)

    if (!institution) {
      return left(new InstitutionNotFoundError())
    }

    const userCanManageInstitution = await canManageInstitution(this.membersRepository, actorId, institutionId)

    if (!userCanManageInstitution) {
      return left(new UnauthorizedError())
    }

    institution.status = InstitutionStatus.ACTIVE

    await this.institutionsRepository.save(institution)

    return right({
      institution,
    })
  }
}
