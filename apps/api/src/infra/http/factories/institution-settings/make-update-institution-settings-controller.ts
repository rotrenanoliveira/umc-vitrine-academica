import { UpdateInstitutionSettingsUseCase } from '@/domain/institution/application/use-cases/institution-settings/update-institution-settings'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionMembersRepository } from '@/infra/database/repositories/drizzle-institution-members-repository'
import { DrizzleInstitutionSettingsRepository } from '@/infra/database/repositories/drizzle-institution-settings-repository'
import { DrizzleInstitutionsRepository } from '@/infra/database/repositories/drizzle-institutions-repository'
import { UpdateInstitutionSettingsController } from '../../controllers/institution-settings/update-institution-settings.controller'

export function makeUpdateInstitutionSettingsController() {
  const institutionsRepository = new DrizzleInstitutionsRepository(db)
  const settingsRepository = new DrizzleInstitutionSettingsRepository(db)
  const membersRepository = new DrizzleInstitutionMembersRepository(db)
  const useCase = new UpdateInstitutionSettingsUseCase(institutionsRepository, settingsRepository, membersRepository)

  return new UpdateInstitutionSettingsController(useCase)
}
