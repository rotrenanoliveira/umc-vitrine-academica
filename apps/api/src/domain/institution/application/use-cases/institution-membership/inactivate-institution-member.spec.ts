import { makeInstitution, makeInstitutionMember } from '@tests/factories/make-institution'
import { InMemoryInstitutionMembersRepository } from '@tests/repositories/in-memory-institution-members-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InstitutionMemberStatus, InstitutionMemberType } from '../../../enterprise/entities/institution-member'
import { InstitutionMemberNotFoundError } from '../../_errors/institution-member-not-found-error'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { InactivateInstitutionMemberUseCase } from './inactivate-institution-member'

let membersRepository: InMemoryInstitutionMembersRepository
let sut: InactivateInstitutionMemberUseCase

describe('(UC) - Inactivate Institution Member', () => {
  beforeEach(() => {
    membersRepository = new InMemoryInstitutionMembersRepository()
    sut = new InactivateInstitutionMemberUseCase(membersRepository)
  })

  it('should be able to inactivate an institution member', async () => {
    const { institution } = makeInstitution()
    const institutionId = institution.id

    membersRepository.items.push(
      makeInstitutionMember({
        userId: new UniqueEntityId('manager-id'),
        type: InstitutionMemberType.MANAGER,
        institutionId,
      }),
    )

    const member = makeInstitutionMember({ institutionId })
    membersRepository.items.push(member)

    const result = await sut.execute({
      memberId: member.id.toString(),
      actorId: 'manager-id',
    })

    expect(result.isRight()).toBe(true)
    expect(member.status).toBe(InstitutionMemberStatus.INACTIVE)
  })

  it('should not be able to inactivate an institution member when the user is not authorized', async () => {
    const { institution } = makeInstitution()
    const institutionId = institution.id

    const member = makeInstitutionMember({ institutionId })
    membersRepository.items.push(member)

    const result = await sut.execute({
      memberId: member.id.toString(),
      actorId: 'user-id',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UnauthorizedError)
    }
  })

  it('should not be able to inactivate an institution member when the institution member does not exist', async () => {
    const result = await sut.execute({
      memberId: 'missing-id',
      actorId: 'manager-id',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InstitutionMemberNotFoundError)
    }
  })
})
