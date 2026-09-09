import { ActivateInstitutionUseCase } from '@/domain/institution/application/use-cases/institution/activate-institution'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionMembersRepository } from '@/infra/database/repositories/drizzle-institution-members-repository'
import { DrizzleInstitutionsRepository } from '@/infra/database/repositories/drizzle-institutions-repository'
import { ActivateInstitutionController } from '../../controllers/institution/activate-institution.controller'

export function makeActivateInstitutionController() {
  const institutionsRepository = new DrizzleInstitutionsRepository(db)
  const membersRepository = new DrizzleInstitutionMembersRepository(db)
  const activateInstitutionUseCase = new ActivateInstitutionUseCase(institutionsRepository, membersRepository)

  return new ActivateInstitutionController(activateInstitutionUseCase)
}
