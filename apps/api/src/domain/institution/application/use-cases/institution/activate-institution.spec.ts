import { makeInstitution, makeInstitutionMember } from '@tests/factories/make-institution'
import { InMemoryInstitutionMembersRepository } from '@tests/repositories/in-memory-institution-members-repository'
import { InMemoryInstitutionsRepository } from '@tests/repositories/in-memory-institutions-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InstitutionStatus } from '../../../enterprise/entities/institution'
import { InstitutionMemberType } from '../../../enterprise/entities/institution-member'
import { InstitutionNotFoundError } from '../../_errors/institution-not-found-error'
import { UnauthorizedError } from '../../_errors/unauthorized-error'
import { ActivateInstitutionUseCase } from './activate-institution'

let institutionsRepository: InMemoryInstitutionsRepository
let membersRepository: InMemoryInstitutionMembersRepository
let sut: ActivateInstitutionUseCase

describe('(UC) - Activate Institution', () => {
  beforeEach(() => {
    institutionsRepository = new InMemoryInstitutionsRepository()
    membersRepository = new InMemoryInstitutionMembersRepository()
    sut = new ActivateInstitutionUseCase(institutionsRepository, membersRepository)
  })

  it('should be able to activate an institution', async () => {
    const { institution } = makeInstitution({ status: InstitutionStatus.INACTIVE })
    institutionsRepository.items.push(institution)

    membersRepository.items.push(
      makeInstitutionMember({
        userId: new UniqueEntityId('manager-id'),
        institutionId: institution.id,
        type: InstitutionMemberType.MANAGER,
      }),
    )

    const result = await sut.execute({ actorId: 'manager-id', institutionId: institution.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(institution.status).toBe(InstitutionStatus.ACTIVE)
  })

  it('should not be able to activate an institution when the user does not have permission', async () => {
    const { institution } = makeInstitution({ status: InstitutionStatus.INACTIVE })
    institutionsRepository.items.push(institution)

    const result = await sut.execute({ actorId: 'user-id', institutionId: institution.id.toString() })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) expect(result.value).toBeInstanceOf(UnauthorizedError)
  })

  it('should return an error when the institution does not exist', async () => {
    const result = await sut.execute({ actorId: 'manager-id', institutionId: 'missing-id' })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InstitutionNotFoundError)
    }
  })
})
