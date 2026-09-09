import { RegisterInstitutionSettingsUseCase } from '@/domain/institution/application/use-cases/institution-settings/register-institution-settings'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionSettingsRepository } from '@/infra/database/repositories/drizzle-institution-settings-repository'
import { DrizzleInstitutionsRepository } from '@/infra/database/repositories/drizzle-institutions-repository'
import { RegisterInstitutionSettingsController } from '../../controllers/institution-settings/register-institution-settings.controller'

export function makeRegisterInstitutionSettingsController() {
  const institutionsRepository = new DrizzleInstitutionsRepository(db)
  const settingsRepository = new DrizzleInstitutionSettingsRepository(db)
  const useCase = new RegisterInstitutionSettingsUseCase(institutionsRepository, settingsRepository)

  return new RegisterInstitutionSettingsController(useCase)
}
