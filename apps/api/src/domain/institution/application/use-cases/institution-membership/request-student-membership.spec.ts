import { makeInstitution } from '@tests/factories/make-institution'
import { InMemoryInstitutionMembersRepository } from '@tests/repositories/in-memory-institution-members-repository'
import { InMemoryInstitutionSettingsRepository } from '@tests/repositories/in-memory-institution-settings-repository'
import { InMemoryInstitutionsRepository } from '@tests/repositories/in-memory-institutions-repository'
import { InstitutionMemberStatus } from '../../../enterprise/entities/institution-member'
import { InstitutionSettings } from '../../../enterprise/entities/institution-settings'
import { UserAlreadyMemberOfInstitutionError } from '../../_errors/user-already-member-of-institution-error'
import { RequestStudentMembershipUseCase } from './request-student-membership'

let institutionsRepository: InMemoryInstitutionsRepository
let settingsRepository: InMemoryInstitutionSettingsRepository
let membersRepository: InMemoryInstitutionMembersRepository
let sut: RequestStudentMembershipUseCase

describe('(UC) - Request Student Membership', () => {
  beforeEach(() => {
    institutionsRepository = new InMemoryInstitutionsRepository()
    settingsRepository = new InMemoryInstitutionSettingsRepository()
    membersRepository = new InMemoryInstitutionMembersRepository()
    sut = new RequestStudentMembershipUseCase(institutionsRepository, settingsRepository, membersRepository)
  })

  it('should be able to request a student membership', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)

    settingsRepository.items.push(
      InstitutionSettings.create({
        institutionId: institution.id,
        shouldProof: true,
        shouldVerify: true,
      }),
    )

    const result = await sut.execute({ userId: 'student-id', institutionId: institution.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(membersRepository.items[0].status).toBe(InstitutionMemberStatus.PENDING)
  })

  it('should not be able to request a student membership when the user is already a member of the institution', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)

    await sut.execute({ userId: 'student-id', institutionId: institution.id.toString() })

    const result = await sut.execute({ userId: 'student-id', institutionId: institution.id.toString() })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UserAlreadyMemberOfInstitutionError)
    }
  })
})
