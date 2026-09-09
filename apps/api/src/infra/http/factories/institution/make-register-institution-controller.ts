import { RegisterInstitutionUseCase } from '@/domain/institution/application/use-cases/institution/register-institution'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionSettingsRepository } from '@/infra/database/repositories/drizzle-institution-settings-repository'
import { DrizzleInstitutionsRepository } from '@/infra/database/repositories/drizzle-institutions-repository'
import { RegisterInstitutionController } from '../../controllers/institution/register-institution.controller'

export function makeRegisterInstitutionController() {
  const institutionsRepository = new DrizzleInstitutionsRepository(db)
  const settingsRepository = new DrizzleInstitutionSettingsRepository(db)
  const registerInstitutionUseCase = new RegisterInstitutionUseCase(institutionsRepository, settingsRepository)

  return new RegisterInstitutionController(registerInstitutionUseCase)
}
