import { type Either, left, right } from '@/core/either'
import { Slug } from '@/core/entities/value-objects/slug'
import type { Institution } from '../../../enterprise/entities/institution'
import { InstitutionAlreadyExistsError } from '../../_errors/institution-already-exists-error'
import { InstitutionNotFoundError } from '../../_errors/institution-not-found-error'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { canManageInstitution } from '../../authorization/can-manage-institution'
import type { InstitutionMembersRepository } from '../../repositories/institution-members-repository'
import type { InstitutionsRepository } from '../../repositories/institutions-repository'

interface EditInstitutionRequest {
  actorId: string
  institutionId: string
  name?: string
  slug?: string
  description?: string
}

type EditInstitutionResponse = Either<
  InstitutionNotFoundError | InstitutionAlreadyExistsError | UnauthorizedError,
  { institution: Institution }
>

export class EditInstitutionUseCase {
  constructor(
    private readonly institutionsRepository: InstitutionsRepository,
    private readonly membersRepository: InstitutionMembersRepository,
  ) {}

  async execute({
    actorId,
    institutionId,
    name,
    slug,
    description,
  }: EditInstitutionRequest): Promise<EditInstitutionResponse> {
    const institution = await this.institutionsRepository.findById(institutionId)

    if (!institution) {
      return left(new InstitutionNotFoundError())
    }

    const userCanManageInstitution = await canManageInstitution(this.membersRepository, actorId, institutionId)

    if (!userCanManageInstitution) {
      return left(new UnauthorizedError())
    }

    if (slug && slug !== institution.slug.value) {
      const slugAlreadyInUse = await this.institutionsRepository.findBySlug(slug)

      if (slugAlreadyInUse) {
        return left(new InstitutionAlreadyExistsError())
      }

      institution.slug = Slug.create(slug)
    }

    if (name !== undefined) institution.name = name
    if (description !== undefined) institution.description = description

    await this.institutionsRepository.save(institution)

    return right({ institution })
  }
}
