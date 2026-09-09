import { and, eq } from 'drizzle-orm'
import type { InstitutionMembersRepository } from '@/domain/institution/application/repositories/institution-members-repository'
import type {
  InstitutionMember,
  InstitutionMemberStatus,
  InstitutionMemberType,
} from '@/domain/institution/enterprise/entities/institution-member'
import type { DrizzleClient } from '../drizzle/client'
import { DrizzleInstitutionMemberMapper } from '../drizzle/mappers/drizzle-institution-member-mapper'
import { institutionMembers } from '../drizzle/schemas'

export class DrizzleInstitutionMembersRepository implements InstitutionMembersRepository {
  constructor(readonly db: DrizzleClient) {}

  async findById(id: string): Promise<InstitutionMember | null> {
    const [row] = await this.db.select().from(institutionMembers).where(eq(institutionMembers.id, id)).limit(1)

    if (!row) return null

    return DrizzleInstitutionMemberMapper.toDomain(row)
  }

  async findByUserAndInstitution(userId: string, institutionId: string): Promise<InstitutionMember | null> {
    const [row] = await this.db
      .select()
      .from(institutionMembers)
      .where(and(eq(institutionMembers.userId, userId), eq(institutionMembers.institutionId, institutionId)))
      .limit(1)

    if (!row) return null

    return DrizzleInstitutionMemberMapper.toDomain(row)
  }

  async findByUserInstitutionAndType(
    userId: string,
    institutionId: string,
    type: InstitutionMemberType,
  ): Promise<InstitutionMember | null> {
    const [row] = await this.db
      .select()
      .from(institutionMembers)
      .where(
        and(
          eq(institutionMembers.userId, userId),
          eq(institutionMembers.institutionId, institutionId),
          eq(institutionMembers.type, type),
        ),
      )
      .limit(1)

    if (!row) return null

    return DrizzleInstitutionMemberMapper.toDomain(row)
  }

  async findManyByInstitution(institutionId: string): Promise<InstitutionMember[]> {
    const rows = await this.db
      .select()
      .from(institutionMembers)
      .where(eq(institutionMembers.institutionId, institutionId))

    return rows.map(DrizzleInstitutionMemberMapper.toDomain)
  }

  async findManyByInstitutionTypeAndStatus(
    institutionId: string,
    type: InstitutionMemberType,
    status: InstitutionMemberStatus,
  ): Promise<InstitutionMember[]> {
    const rows = await this.db
      .select()
      .from(institutionMembers)
      .where(
        and(
          eq(institutionMembers.institutionId, institutionId),
          eq(institutionMembers.type, type),
          eq(institutionMembers.status, status),
        ),
      )

    return rows.map(DrizzleInstitutionMemberMapper.toDomain)
  }

  async create(member: InstitutionMember): Promise<void> {
    await this.db.insert(institutionMembers).values(DrizzleInstitutionMemberMapper.toPersistence(member))
  }

  async save(member: InstitutionMember): Promise<void> {
    await this.db
      .update(institutionMembers)
      .set(DrizzleInstitutionMemberMapper.toPersistence(member))
      .where(eq(institutionMembers.id, member.id.toString()))
  }
}