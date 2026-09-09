import { type Either, right } from '@/core/either'
import type { Institution } from '../../../enterprise/entities/institution'
import type { InstitutionsRepository } from '../../repositories/institutions-repository'

type FetchInstitutionsResponse = Either<unknown, { institutions: Institution[] }>

export class FetchInstitutionsUseCase {
  constructor(private readonly institutionsRepository: InstitutionsRepository) {}

  async execute(): Promise<FetchInstitutionsResponse> {
    const institutions = await this.institutionsRepository.findAll()

    return right({
      institutions,
    })
  }
}
