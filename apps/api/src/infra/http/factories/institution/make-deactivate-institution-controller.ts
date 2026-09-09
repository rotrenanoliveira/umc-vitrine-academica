import { DeactivateInstitutionUseCase } from '@/domain/institution/application/use-cases/institution/deactivate-institution'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionMembersRepository } from '@/infra/database/repositories/drizzle-institution-members-repository'
import { DrizzleInstitutionsRepository } from '@/infra/database/repositories/drizzle-institutions-repository'
import { DeactivateInstitutionController } from '../../controllers/institution/deactivate-institution.controller'

export function makeDeactivateInstitutionController() {
  const institutionsRepository = new DrizzleInstitutionsRepository(db)
  const membersRepository = new DrizzleInstitutionMembersRepository(db)
  const deactivateInstitutionUseCase = new DeactivateInstitutionUseCase(institutionsRepository, membersRepository)

  return new DeactivateInstitutionController(deactivateInstitutionUseCase)
}
