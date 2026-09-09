import { type Either, left, right } from '@/core/either'
import type { InstitutionSettings } from '../../../enterprise/entities/institution-settings'
import { InstitutionNotFoundError } from '../../_errors/institution-not-found-error'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { canManageInstitution } from '../../authorization/can-manage-institution'
import type { InstitutionMembersRepository } from '../../repositories/institution-members-repository'
import type { InstitutionSettingsRepository } from '../../repositories/institution-settings-repository'
import type { InstitutionsRepository } from '../../repositories/institutions-repository'

interface UpdateInstitutionSettingsRequest {
  institutionId: string
  actorId: string
  shouldProof: boolean
  shouldVerify: boolean
}

type UpdateInstitutionSettingsResponse = Either<
  InstitutionNotFoundError | UnauthorizedError,
  { settings: InstitutionSettings }
>

export class UpdateInstitutionSettingsUseCase {
  constructor(
    private readonly institutionsRepository: InstitutionsRepository,
    private readonly settingsRepository: InstitutionSettingsRepository,
    private readonly membersRepository: InstitutionMembersRepository,
  ) {}

  async execute({
    institutionId,
    actorId,
    shouldProof,
    shouldVerify,
  }: UpdateInstitutionSettingsRequest): Promise<UpdateInstitutionSettingsResponse> {
    const institution = await this.institutionsRepository.findById(institutionId)

    if (!institution) {
      return left(new InstitutionNotFoundError())
    }

    const userCanManageInstitution = await canManageInstitution(this.membersRepository, actorId, institutionId)

    if (!userCanManageInstitution) {
      return left(new UnauthorizedError())
    }

    const settings = await this.settingsRepository.findByInstitutionId(institutionId)

    if (!settings) {
      return left(new InstitutionNotFoundError())
    }

    settings.shouldProof = shouldProof
    settings.shouldVerify = shouldVerify

    await this.settingsRepository.save(settings)

    return right({
      settings,
    })
  }
}
