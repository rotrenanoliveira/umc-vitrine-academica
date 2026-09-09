import { makeInstitution, makeInstitutionMember } from '@tests/factories/make-institution'
import { InMemoryInstitutionMembersRepository } from '@tests/repositories/in-memory-institution-members-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InstitutionMemberStatus, InstitutionMemberType } from '../../../enterprise/entities/institution-member'
import { InstitutionMemberNotFoundError } from '../../_errors/institution-member-not-found-error'
import { InstitutionMemberRoleMismatchError } from '../../_errors/institution-member-role-mismatch-errors'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { RemoveStudentFromInstitutionUseCase } from './remove-student-from-institution'

let membersRepository: InMemoryInstitutionMembersRepository
let sut: RemoveStudentFromInstitutionUseCase

describe('(UC) - Remove Student From Institution', () => {
  beforeEach(() => {
    membersRepository = new InMemoryInstitutionMembersRepository()
    sut = new RemoveStudentFromInstitutionUseCase(membersRepository)
  })

  it('should be able to remove a student from an institution', async () => {
    const { institution } = makeInstitution()
    const institutionId = institution.id

    membersRepository.items.push(
      makeInstitutionMember({
        userId: new UniqueEntityId('manager-id'),
        institutionId,
        type: InstitutionMemberType.MANAGER,
      }),
    )

    const student = makeInstitutionMember({ institutionId })
    membersRepository.items.push(student)

    const result = await sut.execute({
      actorId: 'manager-id',
      memberId: student.id.toString(),
      status: InstitutionMemberStatus.FINISHED,
    })

    expect(result.isRight()).toBe(true)
    expect(student.status).toBe(InstitutionMemberStatus.FINISHED)
  })

  it('should not be able to remove a student from an institution when the user is not authorized', async () => {
    const { institution } = makeInstitution()
    const institutionId = institution.id

    const student = makeInstitutionMember({ institutionId })
    membersRepository.items.push(student)

    const result = await sut.execute({
      actorId: 'user-id',
      memberId: student.id.toString(),
      status: InstitutionMemberStatus.FINISHED,
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UnauthorizedError)
    }
  })

  it('should not be able to remove a student from an institution when the institution member does not exist', async () => {
    const result = await sut.execute({
      actorId: 'user-id',
      memberId: 'missing-id',
      status: InstitutionMemberStatus.FINISHED,
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InstitutionMemberNotFoundError)
    }
  })

  it('should not be able to remove a student from an institution when the institution member is not a student', async () => {
    const { institution } = makeInstitution()
    const institutionId = institution.id

    const professor = makeInstitutionMember({ institutionId, type: InstitutionMemberType.PROFESSOR })
    membersRepository.items.push(professor)

    const result = await sut.execute({
      actorId: 'user-id',
      memberId: professor.id.toString(),
      status: InstitutionMemberStatus.FINISHED,
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InstitutionMemberRoleMismatchError)
    }
  })
})
