import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UniqueEntityId as UniqueEntityIdClass } from '@/core/entities/unique-entity-id'
import {
  InstitutionMembershipRequest,
  type InstitutionMembershipRequestProps,
  InstitutionMembershipRequestRole,
} from '@/domain/institution/enterprise/entities/institution-membership-request'

export function makeInstitutionMembershipRequest(
  override: Partial<InstitutionMembershipRequestProps> = {},
  id?: UniqueEntityId,
) {
  const request = InstitutionMembershipRequest.create(
    {
      institutionId: new UniqueEntityIdClass().toString(),
      userId: new UniqueEntityIdClass().toString(),
      role: InstitutionMembershipRequestRole.STUDENT,
      ...override,
    },
    id,
  )

  return { request }
}
