import { ConfigureInstitutionDomainUseCase } from '@/domain/institution/application/use-cases/institution-settings/configure-institution-domain'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionMembersRepository } from '@/infra/database/repositories/drizzle-institution-members-repository'
import { DrizzleInstitutionSettingsRepository } from '@/infra/database/repositories/drizzle-institution-settings-repository'
import { DrizzleInstitutionsRepository } from '@/infra/database/repositories/drizzle-institutions-repository'
import { ConfigureInstitutionDomainController } from '../../controllers/institution-settings/configure-institution-domain.controller'

export function makeConfigureInstitutionDomainController() {
  const institutionsRepository = new DrizzleInstitutionsRepository(db)
  const settingsRepository = new DrizzleInstitutionSettingsRepository(db)
  const membersRepository = new DrizzleInstitutionMembersRepository(db)
  const useCase = new ConfigureInstitutionDomainUseCase(institutionsRepository, settingsRepository, membersRepository)

  return new ConfigureInstitutionDomainController(useCase)
}
