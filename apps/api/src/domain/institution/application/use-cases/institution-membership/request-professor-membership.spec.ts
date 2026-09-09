import { makeInstitution } from '@tests/factories/make-institution'
import { InMemoryInstitutionMembersRepository } from '@tests/repositories/in-memory-institution-members-repository'
import { InMemoryInstitutionSettingsRepository } from '@tests/repositories/in-memory-institution-settings-repository'
import { InMemoryInstitutionsRepository } from '@tests/repositories/in-memory-institutions-repository'
import { InstitutionMemberStatus, InstitutionMemberType } from '../../../enterprise/entities/institution-member'
import { InstitutionNotFoundError } from '../../_errors/institution-not-found-error'
import { UserAlreadyMemberOfInstitutionError } from '../../_errors/user-already-member-of-institution-error'
import { RequestProfessorMembershipUseCase } from './request-professor-membership'

let institutionsRepository: InMemoryInstitutionsRepository
let settingsRepository: InMemoryInstitutionSettingsRepository
let membersRepository: InMemoryInstitutionMembersRepository
let sut: RequestProfessorMembershipUseCase

describe('(UC) - Request Professor Membership', () => {
  beforeEach(() => {
    institutionsRepository = new InMemoryInstitutionsRepository()
    settingsRepository = new InMemoryInstitutionSettingsRepository()
    membersRepository = new InMemoryInstitutionMembersRepository()
    sut = new RequestProfessorMembershipUseCase(institutionsRepository, settingsRepository, membersRepository)
  })

  it('should be able to request a professor membership', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)

    const result = await sut.execute({ userId: 'professor-id', institutionId: institution.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(membersRepository.items[0].type).toBe(InstitutionMemberType.PROFESSOR)
    expect(membersRepository.items[0].status).toBe(InstitutionMemberStatus.ACTIVE)
  })

  it('should not be able to request a professor membership when the user is already a member of the institution', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)

    await sut.execute({ userId: 'professor-id', institutionId: institution.id.toString() })

    const result = await sut.execute({ userId: 'professor-id', institutionId: institution.id.toString() })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UserAlreadyMemberOfInstitutionError)
    }
  })

  it('should not be able to request a professor membership when the institution does not exist', async () => {
    const result = await sut.execute({ userId: 'professor-id', institutionId: 'missing-id' })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InstitutionNotFoundError)
    }
  })
})
