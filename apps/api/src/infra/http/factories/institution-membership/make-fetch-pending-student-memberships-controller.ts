import { FetchPendingStudentMembershipsUseCase } from '@/domain/institution/application/use-cases/institution-membership/fetch-pending-student-memberships'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionsRepository } from '@/infra/database/repositories/drizzle-institutions-repository'
import { DrizzleInstitutionMembersRepository } from '@/infra/database/repositories/drizzle-institution-members-repository'
import { FetchPendingStudentMembershipsController } from '../../controllers/institution-membership/fetch-pending-student-memberships.controller'

export function makeFetchPendingStudentMembershipsController() {
  const institutionsRepository = new DrizzleInstitutionsRepository(db)
  const membersRepository = new DrizzleInstitutionMembersRepository(db)
  const useCase = new FetchPendingStudentMembershipsUseCase(institutionsRepository, membersRepository)
  return new FetchPendingStudentMembershipsController(useCase)
}
