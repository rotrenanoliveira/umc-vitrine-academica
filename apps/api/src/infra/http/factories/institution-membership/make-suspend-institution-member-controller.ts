import { SuspendInstitutionMemberUseCase } from '@/domain/institution/application/use-cases/institution-membership/suspend-institution-member'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionMembersRepository } from '@/infra/database/repositories/drizzle-institution-members-repository'
import { SuspendInstitutionMemberController } from '../../controllers/institution-membership/suspend-institution-member.controller'

export function makeSuspendInstitutionMemberController() {
  const membersRepository = new DrizzleInstitutionMembersRepository(db)
  const useCase = new SuspendInstitutionMemberUseCase(membersRepository)
  return new SuspendInstitutionMemberController(useCase)
}
