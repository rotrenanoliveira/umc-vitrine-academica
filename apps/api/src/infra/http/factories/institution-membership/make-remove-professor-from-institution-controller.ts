import { RemoveProfessorFromInstitutionUseCase } from '@/domain/institution/application/use-cases/institution-membership/remove-professor-from-institution'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionMembersRepository } from '@/infra/database/repositories/drizzle-institution-members-repository'
import { RemoveProfessorFromInstitutionController } from '../../controllers/institution-membership/remove-professor-from-institution.controller'

export function makeRemoveProfessorFromInstitutionController() {
  const membersRepository = new DrizzleInstitutionMembersRepository(db)
  const useCase = new RemoveProfessorFromInstitutionUseCase(membersRepository)
  return new RemoveProfessorFromInstitutionController(useCase)
}
