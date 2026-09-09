import { makeInstitution, makeInstitutionMember } from '@tests/factories/make-institution'
import { InMemoryInstitutionMembersRepository } from '@tests/repositories/in-memory-institution-members-repository'
import { InMemoryInstitutionsRepository } from '@tests/repositories/in-memory-institutions-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Slug } from '@/core/entities/value-objects/slug'
import { InstitutionMemberType } from '../../../enterprise/entities/institution-member'
import { InstitutionAlreadyExistsError } from '../../_errors/institution-already-exists-error'
import { InstitutionNotFoundError } from '../../_errors/institution-not-found-error'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { EditInstitutionUseCase } from './edit-institution'

let institutionsRepository: InMemoryInstitutionsRepository
let membersRepository: InMemoryInstitutionMembersRepository
let sut: EditInstitutionUseCase

describe('(UC) - Edit Institution', () => {
  beforeEach(() => {
    institutionsRepository = new InMemoryInstitutionsRepository()
    membersRepository = new InMemoryInstitutionMembersRepository()
    sut = new EditInstitutionUseCase(institutionsRepository, membersRepository)
  })

  it('should be able to update an institution', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)

    membersRepository.items.push(
      makeInstitutionMember({
        userId: new UniqueEntityId('manager-id'),
        institutionId: institution.id,
        type: InstitutionMemberType.MANAGER,
      }),
    )

    const result = await sut.execute({
      actorId: 'manager-id',
      institutionId: institution.id.toString(),
      name: 'Novo nome',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.institution.name).toBe('Novo nome')
    }

    expect(institutionsRepository.items[0].name).toBe('Novo nome')
  })

  it('should not be able to update an institution with the same slug', async () => {
    institutionsRepository.items.push(
      makeInstitution({
        slug: Slug.createFromText('institution-slug'),
      }).institution,
    )

    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)

    membersRepository.items.push(
      makeInstitutionMember({
        userId: new UniqueEntityId('manager-id'),
        institutionId: institution.id,
        type: InstitutionMemberType.MANAGER,
      }),
    )

    const result = await sut.execute({
      actorId: 'manager-id',
      institutionId: institution.id.toString(),
      name: institution.name,
      slug: 'institution-slug',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InstitutionAlreadyExistsError)
    }
  })

  it('should return an error when the institution does not exist', async () => {
    const result = await sut.execute({ actorId: 'manager-id', institutionId: 'missing-id', name: 'Novo' })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) expect(result.value).toBeInstanceOf(InstitutionNotFoundError)
  })

  it('should return an error when the user is not authorized to edit the institution', async () => {
    const { institution } = makeInstitution()
    institutionsRepository.items.push(institution)

    const result = await sut.execute({ actorId: 'user-id', institutionId: institution.id.toString(), name: 'Novo' })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
