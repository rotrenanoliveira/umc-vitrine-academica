import { FetchActiveInstitutionsUseCase } from '@/domain/institution/application/use-cases/institution/fetch-active-institutions'
import { db } from '@/infra/database/drizzle/client'
import { DrizzleInstitutionsRepository } from '@/infra/database/repositories/drizzle-institutions-repository'
import { FetchActiveInstitutionsController } from '../../controllers/institution/fetch-active-institutions.controller'

export function makeFetchActiveInstitutionsController() {
  const institutionsRepository = new DrizzleInstitutionsRepository(db)
  const fetchActiveInstitutionsUseCase = new FetchActiveInstitutionsUseCase(institutionsRepository)

  return new FetchActiveInstitutionsController(fetchActiveInstitutionsUseCase)
}
