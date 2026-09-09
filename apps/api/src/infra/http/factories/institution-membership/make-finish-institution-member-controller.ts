import { FinishInstitutionMemberUseCase } from '@/domain/institution/application/use-cases/institution-membership/finish-institution-member'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionMembersRepository } from '@/infra/database/repositories/drizzle-institution-members-repository'
import { FinishInstitutionMemberController } from '../../controllers/institution-membership/finish-institution-member.controller'

export function makeFinishInstitutionMemberController() {
  const membersRepository = new DrizzleInstitutionMembersRepository(db)
  const useCase = new FinishInstitutionMemberUseCase(membersRepository)
  return new FinishInstitutionMemberController(useCase)
}
