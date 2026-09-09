import { FetchPendingProfessorMembershipsUseCase } from '@/domain/institution/application/use-cases/institution-membership/fetch-pending-professor-memberships'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionsRepository } from '@/infra/database/repositories/drizzle-institutions-repository'
import { DrizzleInstitutionMembersRepository } from '@/infra/database/repositories/drizzle-institution-members-repository'
import { FetchPendingProfessorMembershipsController } from '../../controllers/institution-membership/fetch-pending-professor-memberships.controller'

export function makeFetchPendingProfessorMembershipsController() {
  const institutionsRepository = new DrizzleInstitutionsRepository(db)
  const membersRepository = new DrizzleInstitutionMembersRepository(db)
  const useCase = new FetchPendingProfessorMembershipsUseCase(institutionsRepository, membersRepository)
  return new FetchPendingProfessorMembershipsController(useCase)
}
