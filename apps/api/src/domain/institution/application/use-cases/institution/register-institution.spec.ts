import { faker } from '@faker-js/faker'
import { makeInstitution } from '@tests/factories/make-institution'
import { InMemoryInstitutionsRepository } from '@tests/repositories/in-memory-institutions-repository'
import { InstitutionStatus, InstitutionType } from '../../../enterprise/entities/institution'
import { InstitutionAlreadyExistsError } from '../../_errors/institution-already-exists-error'
import { RegisterInstitutionUseCase } from './register-institution'

let institutionsRepository: InMemoryInstitutionsRepository
let sut: RegisterInstitutionUseCase

describe('(UC) - Register Institution', () => {
  beforeEach(() => {
    institutionsRepository = new InMemoryInstitutionsRepository()
    sut = new RegisterInstitutionUseCase(institutionsRepository)
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
    }

    expect(institutionsRepository.items[0].slug.value).toBe('universidade-municipal')
    expect(institutionsRepository.items[0].status).toBe(InstitutionStatus.ACTIVE)
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
  })
})
