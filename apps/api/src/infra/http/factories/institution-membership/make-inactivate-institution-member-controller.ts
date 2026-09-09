import { InactivateInstitutionMemberUseCase } from '@/domain/institution/application/use-cases/institution-membership/inactivate-institution-member'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionMembersRepository } from '@/infra/database/repositories/drizzle-institution-members-repository'
import { InactivateInstitutionMemberController } from '../../controllers/institution-membership/inactivate-institution-member.controller'

export function makeInactivateInstitutionMemberController() {
  const membersRepository = new DrizzleInstitutionMembersRepository(db)
  const useCase = new InactivateInstitutionMemberUseCase(membersRepository)
  return new InactivateInstitutionMemberController(useCase)
}
