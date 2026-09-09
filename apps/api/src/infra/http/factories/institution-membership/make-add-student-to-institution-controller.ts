import { AddStudentToInstitutionUseCase } from '@/domain/institution/application/use-cases/institution-membership/add-student-to-institution'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionsRepository } from '@/infra/database/repositories/drizzle-institutions-repository'
import { DrizzleInstitutionMembersRepository } from '@/infra/database/repositories/drizzle-institution-members-repository'
import { AddStudentToInstitutionController } from '../../controllers/institution-membership/add-student-to-institution.controller'

export function makeAddStudentToInstitutionController() {
  const institutionsRepository = new DrizzleInstitutionsRepository(db)
  const membersRepository = new DrizzleInstitutionMembersRepository(db)
  const useCase = new AddStudentToInstitutionUseCase(institutionsRepository, membersRepository)
  return new AddStudentToInstitutionController(useCase)
}
