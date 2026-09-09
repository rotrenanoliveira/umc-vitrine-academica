import { LeaveInstitutionUseCase } from '@/domain/institution/application/use-cases/institution-membership/leave-institution'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionsRepository } from '@/infra/database/repositories/drizzle-institutions-repository'
import { DrizzleInstitutionMembersRepository } from '@/infra/database/repositories/drizzle-institution-members-repository'
import { LeaveInstitutionController } from '../../controllers/institution-membership/leave-institution.controller'

export function makeLeaveInstitutionController() {
  const institutionsRepository = new DrizzleInstitutionsRepository(db)
  const membersRepository = new DrizzleInstitutionMembersRepository(db)
  const useCase = new LeaveInstitutionUseCase(institutionsRepository, membersRepository)
  return new LeaveInstitutionController(useCase)
}
