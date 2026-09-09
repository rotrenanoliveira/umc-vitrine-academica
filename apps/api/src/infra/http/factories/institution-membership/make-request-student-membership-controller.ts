import { RequestStudentMembershipUseCase } from '@/domain/institution/application/use-cases/institution-membership/request-student-membership'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionsRepository } from '@/infra/database/repositories/drizzle-institutions-repository'
import { DrizzleInstitutionMembersRepository } from '@/infra/database/repositories/drizzle-institution-members-repository'
import { DrizzleInstitutionSettingsRepository } from '@/infra/database/repositories/drizzle-institution-settings-repository'
import { RequestStudentMembershipController } from '../../controllers/institution-membership/request-student-membership.controller'

export function makeRequestStudentMembershipController() {
  const institutionsRepository = new DrizzleInstitutionsRepository(db)
  const membersRepository = new DrizzleInstitutionMembersRepository(db)
  const settingsRepository = new DrizzleInstitutionSettingsRepository(db)
  const useCase = new RequestStudentMembershipUseCase(institutionsRepository, settingsRepository, membersRepository)
  return new RequestStudentMembershipController(useCase)
}
