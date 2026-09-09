import { makeInstitution, makeInstitutionMember } from '@tests/factories/make-institution'
import { InMemoryInstitutionMembersRepository } from '@tests/repositories/in-memory-institution-members-repository'
import { InMemoryInstitutionsRepository } from '@tests/repositories/in-memory-institutions-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InstitutionMemberStatus, InstitutionMemberType } from '../../../enterprise/entities/institution-member'
import { InstitutionNotFoundError } from '../../_errors/institution-not-found-error'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { FetchPendingProfessorMembershipsUseCase } from './fetch-pending-professor-memberships'

let institutionsRepository: InMemoryInstitutionsRepository
let membersRepository: InMemoryInstitutionMembersRepository
let sut: FetchPendingProfessorMembershipsUseCase

describe('(UC) - Fetch Pending Professor Memberships', () => {
  beforeEach(() => {
    institutionsRepository = new InMemoryInstitutionsRepository()
    membersRepository = new InMemoryInstitutionMembersRepository()
    sut = new FetchPendingProfessorMembershipsUseCase(institutionsRepository, membersRepository)
  })

  it('should able to fetch the pending professor requests', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)

    membersRepository.items.push(
      makeInstitutionMember({
        userId: new UniqueEntityId('office-id'),
        institutionId: institution.id,
        type: InstitutionMemberType.ADMINISTRATIVE_OFFICE,
      }),
      makeInstitutionMember({
        userId: new UniqueEntityId('pending-professor'),
        institutionId: institution.id,
        type: InstitutionMemberType.PROFESSOR,
        status: InstitutionMemberStatus.PENDING,
      }),
      makeInstitutionMember({
        userId: new UniqueEntityId('active-professor'),
        institutionId: institution.id,
        type: InstitutionMemberType.PROFESSOR,
        status: InstitutionMemberStatus.ACTIVE,
      }),
      makeInstitutionMember({
        userId: new UniqueEntityId('pending-student'),
        institutionId: institution.id,
        type: InstitutionMemberType.STUDENT,
        status: InstitutionMemberStatus.PENDING,
      }),
    )

    const result = await sut.execute({
      actorId: 'office-id',
      institutionId: institution.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.members).toHaveLength(1)
      expect(result.value.members[0].userId.toString()).toBe('pending-professor')
    }
  })

  it('should not be able to fetch the pending professor requests when the actor is not an administrative office', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)

    const result = await sut.execute({
      actorId: 'professor-id',
      institutionId: institution.id.toString(),
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UnauthorizedError)
    }
  })

  it('should not be able to fetch the pending professor requests when the institution does not exist', async () => {
    const result = await sut.execute({
      actorId: 'office-id',
      institutionId: 'missing-id',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InstitutionNotFoundError)
    }
  })
})
