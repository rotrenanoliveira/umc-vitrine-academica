import { type Either, left, right } from '@/core/either'
import type { InstitutionSettings } from '../../../enterprise/entities/institution-settings'
import { InstitutionNotFoundError } from '../../_errors/institution-not-found-error'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { canManageInstitution } from '../../authorization/can-manage-institution'
import type { InstitutionMembersRepository } from '../../repositories/institution-members-repository'
import type { InstitutionSettingsRepository } from '../../repositories/institution-settings-repository'
import type { InstitutionsRepository } from '../../repositories/institutions-repository'

interface ConfigureInstitutionDomainRequest {
  actorId: string
  institutionId: string
  domain?: string
}

type ConfigureInstitutionDomainResponse = Either<
  InstitutionNotFoundError | UnauthorizedError,
  { settings: InstitutionSettings }
>

export class ConfigureInstitutionDomainUseCase {
  constructor(
    private readonly institutionsRepository: InstitutionsRepository,
    private readonly settingsRepository: InstitutionSettingsRepository,
    private readonly membersRepository: InstitutionMembersRepository,
  ) {}

  async execute({
    institutionId,
    actorId,
    domain,
  }: ConfigureInstitutionDomainRequest): Promise<ConfigureInstitutionDomainResponse> {
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

    settings.domain = domain

    await this.settingsRepository.save(settings)

    return right({
      settings,
    })
  }
}
