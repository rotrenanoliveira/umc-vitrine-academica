import { makeInstitution, makeInstitutionMember } from '@tests/factories/make-institution'
import { InMemoryInstitutionMembersRepository } from '@tests/repositories/in-memory-institution-members-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InstitutionMemberStatus, InstitutionMemberType } from '../../../enterprise/entities/institution-member'
import { InstitutionMemberNotFoundError } from '../../_errors/institution-member-not-found-error'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { SuspendInstitutionMemberUseCase } from './suspend-institution-member'

let membersRepository: InMemoryInstitutionMembersRepository
let sut: SuspendInstitutionMemberUseCase

describe('(UC) - Suspend Institution Member', () => {
  beforeEach(() => {
    membersRepository = new InMemoryInstitutionMembersRepository()
    sut = new SuspendInstitutionMemberUseCase(membersRepository)
  })

  it('should be able to suspend an institution member', async () => {
    const { institution } = makeInstitution()
    const institutionId = institution.id

    membersRepository.items.push(
      makeInstitutionMember({
        userId: new UniqueEntityId('manager-id'),
        institutionId,
        type: InstitutionMemberType.MANAGER,
      }),
    )

    const member = makeInstitutionMember({ institutionId })
    membersRepository.items.push(member)

    const result = await sut.execute({ actorId: 'manager-id', memberId: member.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(member.status).toBe(InstitutionMemberStatus.SUSPENDED)
  })

  it('should not be able to suspend an institution member when the user is not authorized', async () => {
    const { institution } = makeInstitution()
    const institutionId = institution.id

    const member = makeInstitutionMember({ institutionId })
    membersRepository.items.push(member)

    const result = await sut.execute({ actorId: 'manager-id', memberId: member.id.toString() })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UnauthorizedError)
    }
  })

  it('should not be able to suspend an institution member when the institution member does not exist', async () => {
    const { institution } = makeInstitution()
    const institutionId = institution.id

    membersRepository.items.push(
      makeInstitutionMember({
        userId: new UniqueEntityId('manager-id'),
        institutionId,
        type: InstitutionMemberType.MANAGER,
      }),
    )

    const result = await sut.execute({ actorId: 'manager-id', memberId: 'missing-id' })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InstitutionMemberNotFoundError)
    }
  })
})
