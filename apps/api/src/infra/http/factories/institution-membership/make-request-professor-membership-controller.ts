import { RequestProfessorMembershipUseCase } from '@/domain/institution/application/use-cases/institution-membership/request-professor-membership'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionsRepository } from '@/infra/database/repositories/drizzle-institutions-repository'
import { DrizzleInstitutionMembersRepository } from '@/infra/database/repositories/drizzle-institution-members-repository'
import { DrizzleInstitutionSettingsRepository } from '@/infra/database/repositories/drizzle-institution-settings-repository'
import { RequestProfessorMembershipController } from '../../controllers/institution-membership/request-professor-membership.controller'

export function makeRequestProfessorMembershipController() {
  const institutionsRepository = new DrizzleInstitutionsRepository(db)
  const membersRepository = new DrizzleInstitutionMembersRepository(db)
  const settingsRepository = new DrizzleInstitutionSettingsRepository(db)
  const useCase = new RequestProfessorMembershipUseCase(institutionsRepository, settingsRepository, membersRepository)
  return new RequestProfessorMembershipController(useCase)
}
