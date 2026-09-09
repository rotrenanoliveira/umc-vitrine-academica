import { makeInstitution, makeInstitutionMember, makeInstitutionSettings } from '@tests/factories/make-institution'
import { InMemoryInstitutionMembersRepository } from '@tests/repositories/in-memory-institution-members-repository'
import { InMemoryInstitutionSettingsRepository } from '@tests/repositories/in-memory-institution-settings-repository'
import { InMemoryInstitutionsRepository } from '@tests/repositories/in-memory-institutions-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InstitutionMemberType } from '../../../enterprise/entities/institution-member'
import { InstitutionNotFoundError } from '../../_errors/institution-not-found-error'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { UpdateInstitutionSettingsUseCase } from './update-institution-settings'

let institutionsRepository: InMemoryInstitutionsRepository
let settingsRepository: InMemoryInstitutionSettingsRepository
let membersRepository: InMemoryInstitutionMembersRepository
let sut: UpdateInstitutionSettingsUseCase

describe('(UC) - Update Institution Settings', () => {
  beforeEach(() => {
    institutionsRepository = new InMemoryInstitutionsRepository()
    settingsRepository = new InMemoryInstitutionSettingsRepository()
    membersRepository = new InMemoryInstitutionMembersRepository()
    sut = new UpdateInstitutionSettingsUseCase(institutionsRepository, settingsRepository, membersRepository)
  })

  it('should be able to update institution settings', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)
    settingsRepository.items.push(makeInstitutionSettings({ institutionId: institution.id }))

    membersRepository.items.push(
      makeInstitutionMember({
        userId: new UniqueEntityId('manager-id'),
        institutionId: institution.id,
        type: InstitutionMemberType.MANAGER,
      }),
    )

    const result = await sut.execute({
      actorId: 'manager-id',
      institutionId: institution.id.toString(),
      shouldProof: true,
      shouldVerify: true,
    })

    expect(result.isRight()).toBe(true)

    expect(settingsRepository.items[0].shouldProof).toBe(true)
    expect(settingsRepository.items[0].shouldVerify).toBe(true)
  })

  it('should not be able to update institution settings when the user is not authorized to do so', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)

    const result = await sut.execute({
      actorId: 'user-id',
      institutionId: institution.id.toString(),
      shouldProof: true,
      shouldVerify: true,
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UnauthorizedError)
    }
  })

  it('should not be able to update institution settings when the institution does not exist', async () => {
    const result = await sut.execute({
      actorId: 'manager-id',
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
