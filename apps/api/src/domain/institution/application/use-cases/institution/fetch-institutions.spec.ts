import { makeInstitution } from '@tests/factories/make-institution'
import { InMemoryInstitutionsRepository } from '@tests/repositories/in-memory-institutions-repository'
import { FetchInstitutionsUseCase } from './fetch-institutions'

let institutionsRepository: InMemoryInstitutionsRepository
let sut: FetchInstitutionsUseCase

describe('(UC) - Fetch Institutions', () => {
  beforeEach(() => {
    institutionsRepository = new InMemoryInstitutionsRepository()
    sut = new FetchInstitutionsUseCase(institutionsRepository)
  })

  it('should able to return a list of institutions', async () => {
    for (let i = 0; i < 10; i++) {
      const { institution } = makeInstitution({ name: `instituicao-${i}` })
      institutionsRepository.items.push(institution)
    }

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.institutions).toHaveLength(10)
    }
  })

  it('should return an empty list when there are no institutions', async () => {
    const result = await sut.execute()

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.institutions).toEqual([])
    }
  })
})
