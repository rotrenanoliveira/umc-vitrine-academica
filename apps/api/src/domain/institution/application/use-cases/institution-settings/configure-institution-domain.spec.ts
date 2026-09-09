import { makeInstitution, makeInstitutionMember, makeInstitutionSettings } from '@tests/factories/make-institution'
import { InMemoryInstitutionMembersRepository } from '@tests/repositories/in-memory-institution-members-repository'
import { InMemoryInstitutionSettingsRepository } from '@tests/repositories/in-memory-institution-settings-repository'
import { InMemoryInstitutionsRepository } from '@tests/repositories/in-memory-institutions-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InstitutionMemberType } from '../../../enterprise/entities/institution-member'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { ConfigureInstitutionDomainUseCase } from './configure-institution-domain'

let institutionsRepository: InMemoryInstitutionsRepository
let settingsRepository: InMemoryInstitutionSettingsRepository
let membersRepository: InMemoryInstitutionMembersRepository
let sut: ConfigureInstitutionDomainUseCase

describe('(UC) - Configure Institution Domain', () => {
  beforeEach(() => {
    institutionsRepository = new InMemoryInstitutionsRepository()
    settingsRepository = new InMemoryInstitutionSettingsRepository()
    membersRepository = new InMemoryInstitutionMembersRepository()
    sut = new ConfigureInstitutionDomainUseCase(institutionsRepository, settingsRepository, membersRepository)
  })

  it('should be able to configure an institution domain', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)
    settingsRepository.items.push(makeInstitutionSettings({ institutionId: institution.id }))

    membersRepository.items.push(
      makeInstitutionMember({
        userId: new UniqueEntityId('office-id'),
        institutionId: institution.id,
        type: InstitutionMemberType.ADMINISTRATIVE_OFFICE,
      }),
    )

    const result = await sut.execute({
      actorId: 'office-id',
      institutionId: institution.id.toString(),
      domain: 'universidade.edu.br',
    })

    expect(result.isRight()).toBe(true)
    expect(settingsRepository.items[0].domain).toBe('universidade.edu.br')
  })

  it('should not be able to configure an institution domain when the user is not authorized to do so', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)

    const result = await sut.execute({
      actorId: 'user-id',
      institutionId: institution.id.toString(),
      domain: 'universidade.edu.br',
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
