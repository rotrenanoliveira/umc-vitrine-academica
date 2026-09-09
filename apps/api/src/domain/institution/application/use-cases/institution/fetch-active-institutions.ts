import { type Either, right } from '@/core/either'
import type { Institution } from '../../../enterprise/entities/institution'
import type { InstitutionsRepository } from '../../repositories/institutions-repository'

type FetchActiveInstitutionsResponse = Either<never, { institutions: Institution[] }>

export class FetchActiveInstitutionsUseCase {
  constructor(private readonly institutionsRepository: InstitutionsRepository) {}

  async execute(): Promise<FetchActiveInstitutionsResponse> {
    const institutions = await this.institutionsRepository.findManyActive()
    return right({ institutions })
  }
}
