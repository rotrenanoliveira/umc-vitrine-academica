import { makeInstitution, makeInstitutionMember } from '@tests/factories/make-institution'
import { InMemoryInstitutionMembersRepository } from '@tests/repositories/in-memory-institution-members-repository'
import { InMemoryInstitutionsRepository } from '@tests/repositories/in-memory-institutions-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InstitutionMemberStatus } from '../../../enterprise/entities/institution-member'
import { InstitutionMemberNotFoundError } from '../../_errors/institution-member-not-found-error'
import { InstitutionNotFoundError } from '../../_errors/institution-not-found-error'
import { LeaveInstitutionUseCase } from './leave-institution'

let institutionsRepository: InMemoryInstitutionsRepository
let membersRepository: InMemoryInstitutionMembersRepository
let sut: LeaveInstitutionUseCase

describe('(UC) - Leave Institution', () => {
  beforeEach(() => {
    institutionsRepository = new InMemoryInstitutionsRepository()
    membersRepository = new InMemoryInstitutionMembersRepository()
    sut = new LeaveInstitutionUseCase(institutionsRepository, membersRepository)
  })

  it('should be able to leave an institution', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)
    const institutionId = institution.id

    const member = makeInstitutionMember({ userId: new UniqueEntityId('student-id'), institutionId })
    membersRepository.items.push(member)

    const result = await sut.execute({
      institutionId: institutionId.toString(),
      userId: 'student-id',
    })

    expect(result.isRight()).toBe(true)
    expect(membersRepository.items).toHaveLength(1)
    expect(member.status).toBe(InstitutionMemberStatus.FINISHED)
  })

  it('should not be able to leave an institution when the institution does not exist', async () => {
    const result = await sut.execute({
      institutionId: 'invalid-institution-id',
      userId: 'student-id',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InstitutionNotFoundError)
    }
  })

  it('should not be able to leave an institution if user is not a member of', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)
    const institutionId = institution.id

    const result = await sut.execute({
      institutionId: institutionId.toString(),
      userId: 'invalid-student-id',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InstitutionMemberNotFoundError)
    }
  })
})
