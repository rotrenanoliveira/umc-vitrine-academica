import { makeInstitution, makeInstitutionMember } from '@tests/factories/make-institution'
import { InMemoryInstitutionMembersRepository } from '@tests/repositories/in-memory-institution-members-repository'
import { InMemoryInstitutionsRepository } from '@tests/repositories/in-memory-institutions-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InstitutionMemberStatus, InstitutionMemberType } from '../../../enterprise/entities/institution-member'
import { InstitutionNotFoundError } from '../../_errors/institution-not-found-error'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { FetchPendingStudentMembershipsUseCase } from './fetch-pending-student-memberships'

let institutionsRepository: InMemoryInstitutionsRepository
let membersRepository: InMemoryInstitutionMembersRepository
let sut: FetchPendingStudentMembershipsUseCase

describe('(UC) - Fetch Pending Student Memberships', () => {
  beforeEach(() => {
    institutionsRepository = new InMemoryInstitutionsRepository()
    membersRepository = new InMemoryInstitutionMembersRepository()
    sut = new FetchPendingStudentMembershipsUseCase(institutionsRepository, membersRepository)
  })

  it('should be able to fetch the pending student requests', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)

    membersRepository.items.push(
      makeInstitutionMember({
        userId: new UniqueEntityId('manager-id'),
        institutionId: institution.id,
        type: InstitutionMemberType.MANAGER,
      }),
      makeInstitutionMember({
        userId: new UniqueEntityId('pending-student'),
        institutionId: institution.id,
        type: InstitutionMemberType.STUDENT,
        status: InstitutionMemberStatus.PENDING,
      }),
      makeInstitutionMember({
        userId: new UniqueEntityId('active-student'),
        institutionId: institution.id,
        type: InstitutionMemberType.STUDENT,
        status: InstitutionMemberStatus.ACTIVE,
      }),
      makeInstitutionMember({
        userId: new UniqueEntityId('pending-professor'),
        institutionId: institution.id,
        type: InstitutionMemberType.PROFESSOR,
        status: InstitutionMemberStatus.PENDING,
      }),
    )

    const result = await sut.execute({
      actorId: 'manager-id',
      institutionId: institution.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.members).toHaveLength(1)
      expect(result.value.members[0].userId.toString()).toBe('pending-student')
    }
  })

  it('should not be able to fetch the pending student requests when the actor is not a manager', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)

    const result = await sut.execute({
      actorId: 'student-id',
      institutionId: institution.id.toString(),
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UnauthorizedError)
    }
  })

  it('should not be able to fetch the pending student requests when the institution does not exist', async () => {
    const result = await sut.execute({
      actorId: 'manager-id',
      institutionId: 'missing-id',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InstitutionNotFoundError)
    }
  })
})
