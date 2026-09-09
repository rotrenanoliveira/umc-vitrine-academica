import type {
  InstitutionMember,
  InstitutionMemberStatus,
  InstitutionMemberType,
} from '../../enterprise/entities/institution-member'

export interface InstitutionMembersRepository {
  findById(id: string): Promise<InstitutionMember | null>
  findByUserAndInstitution(userId: string, institutionId: string): Promise<InstitutionMember | null>
  findByUserInstitutionAndType(
    userId: string,
    institutionId: string,
    type: InstitutionMemberType,
  ): Promise<InstitutionMember | null>
  findManyByInstitution(institutionId: string): Promise<InstitutionMember[]>
  findManyByInstitutionTypeAndStatus(
    institutionId: string,
    type: InstitutionMemberType,
    status: InstitutionMemberStatus,
  ): Promise<InstitutionMember[]>

  create(member: InstitutionMember): Promise<void>
  save(member: InstitutionMember): Promise<void>
}
