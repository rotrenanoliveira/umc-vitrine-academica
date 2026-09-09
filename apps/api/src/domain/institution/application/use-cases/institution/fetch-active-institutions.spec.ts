import { makeInstitution } from '@tests/factories/make-institution'
import { InMemoryInstitutionsRepository } from '@tests/repositories/in-memory-institutions-repository'
import { InstitutionStatus } from '../../../enterprise/entities/institution'
import { FetchActiveInstitutionsUseCase } from './fetch-active-institutions'

let institutionsRepository: InMemoryInstitutionsRepository
let sut: FetchActiveInstitutionsUseCase

describe('(UC) - Fetch Active Institutions', () => {
  beforeEach(() => {
    institutionsRepository = new InMemoryInstitutionsRepository()
    sut = new FetchActiveInstitutionsUseCase(institutionsRepository)
  })

  it('should be able to list only active institutions', async () => {
    for (let i = 0; i < 5; i++) {
      const { institution } = makeInstitution({ name: `instituicao-${i}` })
      institutionsRepository.items.push(institution)
    }

    const { institution } = makeInstitution({ name: 'inativa', status: InstitutionStatus.INACTIVE })
    institutionsRepository.items.push(institution)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.institutions).toHaveLength(5)
    }
  })
})
