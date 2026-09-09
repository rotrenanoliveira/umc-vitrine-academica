import { RemoveStudentFromInstitutionUseCase } from '@/domain/institution/application/use-cases/institution-membership/remove-student-from-institution'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionMembersRepository } from '@/infra/database/repositories/drizzle-institution-members-repository'
import { RemoveStudentFromInstitutionController } from '../../controllers/institution-membership/remove-student-from-institution.controller'

export function makeRemoveStudentFromInstitutionController() {
  const membersRepository = new DrizzleInstitutionMembersRepository(db)
  const useCase = new RemoveStudentFromInstitutionUseCase(membersRepository)
  return new RemoveStudentFromInstitutionController(useCase)
}
