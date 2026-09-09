import type { InstitutionMember } from '@/domain/institution/enterprise/entities/institution-member'

export class InstitutionMemberPresenter {
  static toHTTP(member: InstitutionMember) {
    return {
      id: member.id.toString(),
      userId: member.userId.toString(),
      institutionId: member.institutionId.toString(),
      type: member.type,
      status: member.status,
      createdAt: member.createdAt.toISOString(),
      updatedAt: member.updatedAt?.toISOString() ?? null,
    }
  }
}
