import { InstitutionMemberStatus, InstitutionMemberType } from '../../enterprise/entities/institution-member'
import type { InstitutionMembersRepository } from '../repositories/institution-members-repository'

export async function canManageInstitution(
  membersRepository: InstitutionMembersRepository,
  userId: string,
  institutionId: string,
) {
  const memberships = await membersRepository.findByUserAndInstitution(userId, institutionId)

  if (!memberships) {
    return false
  }

  return (
    memberships.status === InstitutionMemberStatus.ACTIVE &&
    (memberships.type === InstitutionMemberType.MANAGER ||
      memberships.type === InstitutionMemberType.ADMINISTRATIVE_OFFICE)
  )
}
