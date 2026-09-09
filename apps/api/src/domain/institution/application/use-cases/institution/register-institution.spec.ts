import { faker } from '@faker-js/faker'
import { makeInstitution } from '@tests/factories/make-institution'
import { InMemoryInstitutionSettingsRepository } from '@tests/repositories/in-memory-institution-settings-repository'
import { InMemoryInstitutionsRepository } from '@tests/repositories/in-memory-institutions-repository'
import { InstitutionStatus, InstitutionType } from '../../../enterprise/entities/institution'
import { InstitutionAlreadyExistsError } from '../../_errors/institution-already-exists-error'
import { RegisterInstitutionUseCase } from './register-institution'

let institutionsRepository: InMemoryInstitutionsRepository
let settingsRepository: InMemoryInstitutionSettingsRepository
let sut: RegisterInstitutionUseCase

describe('(UC) - Register Institution', () => {
  beforeEach(() => {
    institutionsRepository = new InMemoryInstitutionsRepository()
    settingsRepository = new InMemoryInstitutionSettingsRepository()
    sut = new RegisterInstitutionUseCase(institutionsRepository, settingsRepository)
  })

  it('should be able to register an institution', async () => {
    const result = await sut.execute({
      name: 'Universidade Municipal',
      type: InstitutionType.UNIVERSITY,
      description: 'Uma instituição de ensino superior',
      registeredBy: 'admin-id',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.institution.name).toBe('Universidade Municipal')
      expect(result.value.institution.slug.value).toBe('universidade-municipal')
      expect(result.value.institution.type).toBe(InstitutionType.UNIVERSITY)
      expect(result.value.institution.description).toBe('Uma instituição de ensino superior')
      expect(result.value.institution.registerBy.toString()).toBe('admin-id')
      expect(result.value.settings.shouldProof).toBe(false)
      expect(result.value.settings.shouldVerify).toBe(false)
      expect(result.value.settings.institutionId.toString()).toBe(result.value.institution.id.toString())
    }

    expect(institutionsRepository.items[0].slug.value).toBe('universidade-municipal')
    expect(institutionsRepository.items[0].status).toBe(InstitutionStatus.ACTIVE)
    expect(settingsRepository.items).toHaveLength(1)
  })

  it('should be able to register an institution with custom settings', async () => {
    const result = await sut.execute({
      name: 'Universidade Municipal',
      type: InstitutionType.UNIVERSITY,
      description: 'Uma instituição de ensino superior',
      registeredBy: 'admin-id',
      shouldProof: true,
      shouldVerify: true,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.settings.shouldProof).toBe(true)
      expect(result.value.settings.shouldVerify).toBe(true)
    }
  })

  it('should not be able to register an institution with the same slug', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)

    const result = await sut.execute({
      name: institution.name,
      type: InstitutionType.UNIVERSITY,
      description: faker.lorem.sentence(),
      registeredBy: 'admin-id',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InstitutionAlreadyExistsError)
      expect(result.value.message).toBe('Já existe uma instituição com este slug')
    }

    expect(settingsRepository.items).toHaveLength(0)
  })
})
