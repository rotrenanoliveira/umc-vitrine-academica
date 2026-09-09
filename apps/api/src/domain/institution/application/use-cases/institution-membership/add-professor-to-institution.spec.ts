import { makeInstitution, makeInstitutionMember } from '@tests/factories/make-institution'
import { InMemoryInstitutionMembersRepository } from '@tests/repositories/in-memory-institution-members-repository'
import { InMemoryInstitutionsRepository } from '@tests/repositories/in-memory-institutions-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InstitutionMemberType } from '../../../enterprise/entities/institution-member'
import { InstitutionNotFoundError } from '../../_errors/institution-not-found-error'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { AddProfessorToInstitutionUseCase } from './add-professor-to-institution'

let institutionsRepository: InMemoryInstitutionsRepository
let membersRepository: InMemoryInstitutionMembersRepository
let sut: AddProfessorToInstitutionUseCase

describe('(UC) - Add Professor To Institution', () => {
  beforeEach(() => {
    institutionsRepository = new InMemoryInstitutionsRepository()
    membersRepository = new InMemoryInstitutionMembersRepository()
    sut = new AddProfessorToInstitutionUseCase(institutionsRepository, membersRepository)
  })

  it('should be able to add a professor to an institution', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)

    membersRepository.items.push(
      makeInstitutionMember({
        userId: new UniqueEntityId('office-id'),
        institutionId: institution.id,
        type: InstitutionMemberType.ADMINISTRATIVE_OFFICE,
      }),
    )

    const result = await sut.execute({
      institutionId: institution.id.toString(),
      userId: 'professor-id',
      actorId: 'office-id',
    })

    expect(result.isRight()).toBe(true)
    expect(membersRepository.items[1].type).toBe(InstitutionMemberType.PROFESSOR)
  })

  it('should not be able to add a professor to an institution when the user is not authorized to do so', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)

    const result = await sut.execute({
      actorId: 'user-id',
      userId: 'professor-id',
      institutionId: institution.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) expect(result.value).toBeInstanceOf(UnauthorizedError)
  })

  it('should not be able to add a professor to an institution when the institution does not exist', async () => {
    const result = await sut.execute({
      actorId: 'user-id',
      userId: 'professor-id',
      institutionId: 'missing-id',
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) expect(result.value).toBeInstanceOf(InstitutionNotFoundError)
  })
})
