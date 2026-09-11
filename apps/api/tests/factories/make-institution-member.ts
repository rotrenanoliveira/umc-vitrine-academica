import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UniqueEntityId as UniqueEntityIdClass } from '@/core/entities/unique-entity-id'
import {
  InstitutionMember,
  type InstitutionMemberProps,
  InstitutionMemberRole,
} from '@/domain/institution/enterprise/entities/institution-member'

export function makeInstitutionMember(override: Partial<InstitutionMemberProps> = {}, id?: UniqueEntityId) {
  const member = InstitutionMember.create(
    {
      institutionId: new UniqueEntityIdClass().toString(),
      userId: new UniqueEntityIdClass().toString(),
      role: InstitutionMemberRole.STUDENT,
      ...override,
    },
    id,
  )

  return { member }
}
