import type { InstitutionMembersRepository } from '@/domain/institution/application/repositories/institution-members-repository'
import type {
  InstitutionMember,
  InstitutionMemberStatus,
  InstitutionMemberType,
} from '@/domain/institution/enterprise/entities/institution-member'

export class InMemoryInstitutionMembersRepository implements InstitutionMembersRepository {
  public items: InstitutionMember[] = []

  async findById(id: string) {
    return this.items.find((member) => member.id.toString() === id) ?? null
  }

  async findByUserAndInstitution(userId: string, institutionId: string) {
    return (
      this.items.find(
        (member) => member.userId.toString() === userId && member.institutionId.toString() === institutionId,
      ) ?? null
    )
  }

  async findByUserInstitutionAndType(userId: string, institutionId: string, type: InstitutionMemberType) {
    return (
      this.items.find(
        (member) =>
          member.userId.toString() === userId &&
          member.institutionId.toString() === institutionId &&
          member.type === type,
      ) ?? null
    )
  }

  async findManyByInstitution(institutionId: string) {
    return this.items.filter((member) => member.institutionId.toString() === institutionId)
  }

  async findManyByInstitutionTypeAndStatus(
    institutionId: string,
    type: InstitutionMemberType,
    status: InstitutionMemberStatus,
  ) {
    return this.items.filter(
      (member) => member.institutionId.toString() === institutionId && member.type === type && member.status === status,
    )
  }

  async create(member: InstitutionMember) {
    this.items.push(member)
  }

  async save(member: InstitutionMember) {
    const index = this.items.findIndex((item) => item.id.toString() === member.id.toString())
    if (index >= 0) this.items[index] = member
  }
}
