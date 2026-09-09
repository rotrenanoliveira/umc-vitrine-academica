import { type Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InstitutionSettings } from '../../enterprise/entities/institution-settings'
import { InstitutionNotFoundError } from '../_errors/institution-not-found-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { canManageInstitution } from '../authorization/can-manage-institution'
import type { InstitutionMembersRepository } from '../repositories/institution-members-repository'
import type { InstitutionSettingsRepository } from '../repositories/institution-settings-repository'
import type { InstitutionsRepository } from '../repositories/institutions-repository'

interface ConfigureInstitutionRequest {
  institutionsRepository: InstitutionsRepository
  settingsRepository: InstitutionSettingsRepository
  membersRepository: InstitutionMembersRepository
  actorId: string
  institutionId: string
}

export type ConfigureInstitutionResponse = Either<
  InstitutionNotFoundError | UnauthorizedError,
  { settings: InstitutionSettings }
>

export async function getAuthorizedInstitutionSettings({
  institutionsRepository,
  settingsRepository,
  membersRepository,
  actorId,
  institutionId,
}: ConfigureInstitutionRequest): Promise<ConfigureInstitutionResponse> {
  const institution = await institutionsRepository.findById(institutionId)
  if (!institution) return left(new InstitutionNotFoundError())

  if (!(await canManageInstitution(membersRepository, actorId, institutionId))) {
    return left(new UnauthorizedError())
  }

  const settings =
    (await settingsRepository.findByInstitutionId(institutionId)) ??
    InstitutionSettings.create({
      institutionId: new UniqueEntityId(institutionId),
      shouldProof: false,
      shouldVerify: false,
    })

  return right({ settings })
}
