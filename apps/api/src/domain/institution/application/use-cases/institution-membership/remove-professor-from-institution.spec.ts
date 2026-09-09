import { makeInstitutionMember } from '@tests/factories/make-institution'
import { InMemoryInstitutionMembersRepository } from '@tests/repositories/in-memory-institution-members-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InstitutionMemberStatus, InstitutionMemberType } from '../../../enterprise/entities/institution-member'
import { InstitutionMemberNotFoundError } from '../../_errors/institution-member-not-found-error'
import { InstitutionMemberRoleMismatchError } from '../../_errors/institution-member-role-mismatch-errors'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { RemoveProfessorFromInstitutionUseCase } from './remove-professor-from-institution'

let membersRepository: InMemoryInstitutionMembersRepository
let sut: RemoveProfessorFromInstitutionUseCase

describe('(UC) - Remove Professor From Institution', () => {
  beforeEach(() => {
    membersRepository = new InMemoryInstitutionMembersRepository()
    sut = new RemoveProfessorFromInstitutionUseCase(membersRepository)
  })

  it('should able to remove a professor from an institution', async () => {
    const institutionId = new UniqueEntityId('institution-id')
    membersRepository.items.push(
      makeInstitutionMember({
        userId: new UniqueEntityId('office-id'),
        institutionId,
        type: InstitutionMemberType.ADMINISTRATIVE_OFFICE,
      }),
    )

    const professor = makeInstitutionMember({ institutionId, type: InstitutionMemberType.PROFESSOR })
    membersRepository.items.push(professor)

    const result = await sut.execute({
      actorId: 'office-id',
      memberId: professor.id.toString(),
      status: InstitutionMemberStatus.SUSPENDED,
    })

    expect(result.isRight()).toBe(true)
    expect(professor.status).toBe(InstitutionMemberStatus.SUSPENDED)
  })

  it('should not be able to remove a professor from an institution when the user is not authorized', async () => {
    const institutionId = new UniqueEntityId('institution-id')
    membersRepository.items.push(
      makeInstitutionMember({
        userId: new UniqueEntityId('office-id'),
        institutionId,
        type: InstitutionMemberType.ADMINISTRATIVE_OFFICE,
      }),
    )

    const professor = makeInstitutionMember({ institutionId, type: InstitutionMemberType.PROFESSOR })
    membersRepository.items.push(professor)

    const result = await sut.execute({
      actorId: 'user-id',
      memberId: professor.id.toString(),
      status: InstitutionMemberStatus.SUSPENDED,
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UnauthorizedError)
    }
  })

  it('should not be able to remove a professor from an institution when the institution member does not exist', async () => {
    const result = await sut.execute({
      actorId: 'office-id',
      memberId: 'missing-id',
      status: InstitutionMemberStatus.SUSPENDED,
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InstitutionMemberNotFoundError)
    }
  })

  it('should not be able to remove a professor from an institution when the institution member is not a professor', async () => {
    const institutionId = new UniqueEntityId('institution-id')
    membersRepository.items.push(
      makeInstitutionMember({
        userId: new UniqueEntityId('office-id'),
        institutionId,
        type: InstitutionMemberType.ADMINISTRATIVE_OFFICE,
      }),
    )

    const student = makeInstitutionMember({ institutionId, type: InstitutionMemberType.STUDENT })
    membersRepository.items.push(student)

    const result = await sut.execute({
      actorId: 'office-id',
      memberId: student.id.toString(),
      status: InstitutionMemberStatus.SUSPENDED,
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InstitutionMemberRoleMismatchError)
    }
  })
})
