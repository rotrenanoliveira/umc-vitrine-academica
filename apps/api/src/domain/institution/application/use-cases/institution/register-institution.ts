import { type Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Slug } from '@/core/entities/value-objects/slug'
import { Institution, InstitutionOrigin, type InstitutionType } from '../../../enterprise/entities/institution'
import { InstitutionSettings } from '../../../enterprise/entities/institution-settings'
import { InstitutionAlreadyExistsError } from '../../_errors/institution-already-exists-error'
import type { InstitutionSettingsRepository } from '../../repositories/institution-settings-repository'
import type { InstitutionsRepository } from '../../repositories/institutions-repository'

interface RegisterInstitutionRequest {
  name: string
  type: InstitutionType
  description: string
  registeredBy: string
  shouldProof?: boolean
  shouldVerify?: boolean
}

type RegisterInstitutionResponse = Either<
  InstitutionAlreadyExistsError,
  { institution: Institution; settings: InstitutionSettings }
>

export class RegisterInstitutionUseCase {
  constructor(
    private readonly institutionsRepository: InstitutionsRepository,
    private readonly settingsRepository: InstitutionSettingsRepository,
  ) {}

  async execute({
    name,
    type,
    description,
    registeredBy,
    shouldProof = false,
    shouldVerify = false,
  }: RegisterInstitutionRequest): Promise<RegisterInstitutionResponse> {
    const institutionSlug = Slug.createFromText(name)

    const institutionWithSameSlug = await this.institutionsRepository.findBySlug(institutionSlug.value)

    if (institutionWithSameSlug) {
      return left(new InstitutionAlreadyExistsError())
    }

    const institution = Institution.create({
      name,
      type,
      description,
      slug: institutionSlug,
      origin: InstitutionOrigin.ADMIN,
      registerBy: new UniqueEntityId(registeredBy),
    })

    await this.institutionsRepository.create(institution)

    const settings = InstitutionSettings.create({
      institutionId: institution.id,
      shouldProof,
      shouldVerify,
    })

    await this.settingsRepository.create(settings)

    return right({
      institution,
      settings,
    })
  }
}
