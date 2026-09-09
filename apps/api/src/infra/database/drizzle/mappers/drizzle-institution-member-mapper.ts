import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  InstitutionMember,
  type InstitutionMemberStatus,
  type InstitutionMemberType,
} from '@/domain/institution/enterprise/entities/institution-member'
import type { institutionMembers } from '../schemas/institution-members'

type DrizzleInstitutionMember = typeof institutionMembers.$inferSelect
type DrizzleInstitutionMemberInsert = typeof institutionMembers.$inferInsert

export class DrizzleInstitutionMemberMapper {
  static toDomain(row: DrizzleInstitutionMember): InstitutionMember {
    return InstitutionMember.create(
      {
        userId: new UniqueEntityId(row.userId),
        institutionId: new UniqueEntityId(row.institutionId),
        type: row.type as InstitutionMemberType,
        status: row.status as InstitutionMemberStatus,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
      new UniqueEntityId(row.id),
    )
  }

  static toPersistence(member: InstitutionMember): DrizzleInstitutionMemberInsert {
    return {
      id: member.id.toString(),
      userId: member.userId.toString(),
      institutionId: member.institutionId.toString(),
      type: member.type,
      status: member.status,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt ?? undefined,
    }
  }
}
