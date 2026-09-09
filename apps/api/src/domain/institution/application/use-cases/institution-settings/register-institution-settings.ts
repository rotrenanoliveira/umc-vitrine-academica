import { type Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InstitutionSettings } from '@/domain/institution/enterprise/entities/institution-settings'
import { InstitutionNotFoundError } from '../../_errors/institution-not-found-error'
import type { InstitutionSettingsRepository } from '../../repositories/institution-settings-repository'
import type { InstitutionsRepository } from '../../repositories/institutions-repository'

interface RegisterInstitutionSettingsRequest {
  institutionId: string
  shouldProof: boolean
  shouldVerify: boolean
}

type RegisterInstitutionSettingsResponse = Either<InstitutionNotFoundError, { settings: InstitutionSettings }>

export class RegisterInstitutionSettingsUseCase {
  constructor(
    private readonly institutionsRepository: InstitutionsRepository,
    private readonly institutionsSettingsRepository: InstitutionSettingsRepository,
  ) {}

  async execute({
    institutionId,
    shouldProof,
    shouldVerify,
  }: RegisterInstitutionSettingsRequest): Promise<RegisterInstitutionSettingsResponse> {
    const institution = await this.institutionsRepository.findById(institutionId)

    if (!institution) {
      return left(new InstitutionNotFoundError())
    }

    const settings = InstitutionSettings.create({
      institutionId: new UniqueEntityId(institutionId),
      shouldProof,
      shouldVerify,
    })

    await this.institutionsSettingsRepository.create(settings)

    return right({
      settings,
    })
  }
}
