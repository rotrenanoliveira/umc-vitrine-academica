import { makeInstitution } from '@tests/factories/make-institution'
import { InMemoryInstitutionSettingsRepository } from '@tests/repositories/in-memory-institution-settings-repository'
import { InMemoryInstitutionsRepository } from '@tests/repositories/in-memory-institutions-repository'
import { InstitutionNotFoundError } from '../../_errors/institution-not-found-error'
import { RegisterInstitutionSettingsUseCase } from './register-institution-settings'

let institutionsRepository: InMemoryInstitutionsRepository
let institutionsSettingsRepository: InMemoryInstitutionSettingsRepository
let sut: RegisterInstitutionSettingsUseCase

describe('(UC) - Register Institution Settings', () => {
  beforeEach(() => {
    institutionsRepository = new InMemoryInstitutionsRepository()
    institutionsSettingsRepository = new InMemoryInstitutionSettingsRepository()
    sut = new RegisterInstitutionSettingsUseCase(institutionsRepository, institutionsSettingsRepository)
  })

  it('should be able to register institution settings', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)

    const result = await sut.execute({
      institutionId: institution.id.toString(),
      shouldProof: true,
      shouldVerify: true,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.settings.institutionId.toString()).toBe(institution.id.toString())
      expect(result.value.settings.shouldProof).toBe(true)
      expect(result.value.settings.shouldVerify).toBe(true)
    }
  })

  it('should not be able to register institution settings when the institution does not exist', async () => {
    const result = await sut.execute({
      institutionId: 'missing-id',
      shouldProof: true,
      shouldVerify: true,
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InstitutionNotFoundError)
    }
  })
})
