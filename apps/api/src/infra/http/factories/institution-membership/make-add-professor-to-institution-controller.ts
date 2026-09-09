import { AddProfessorToInstitutionUseCase } from '@/domain/institution/application/use-cases/institution-membership/add-professor-to-institution'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionsRepository } from '@/infra/database/repositories/drizzle-institutions-repository'
import { DrizzleInstitutionMembersRepository } from '@/infra/database/repositories/drizzle-institution-members-repository'
import { AddProfessorToInstitutionController } from '../../controllers/institution-membership/add-professor-to-institution.controller'

export function makeAddProfessorToInstitutionController() {
  const institutionsRepository = new DrizzleInstitutionsRepository(db)
  const membersRepository = new DrizzleInstitutionMembersRepository(db)
  const useCase = new AddProfessorToInstitutionUseCase(institutionsRepository, membersRepository)
  return new AddProfessorToInstitutionController(useCase)
}
