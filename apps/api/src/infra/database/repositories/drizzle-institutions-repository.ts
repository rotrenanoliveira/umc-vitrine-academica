import { eq } from 'drizzle-orm'
import type { InstitutionsRepository } from '@/domain/institution/application/repositories/institutions-repository'
import { type Institution, InstitutionStatus } from '@/domain/institution/enterprise/entities/institution'
import type { DrizzleClient } from '../drizzle/client'
import { DrizzleInstitutionMapper } from '../drizzle/mappers/drizzle-institution-mapper'
import { institutions } from '../drizzle/schemas'

export class DrizzleInstitutionsRepository implements InstitutionsRepository {
  constructor(readonly db: DrizzleClient) {}

  async findById(id: string): Promise<Institution | null> {
    const [row] = await this.db.select().from(institutions).where(eq(institutions.id, id)).limit(1)

    if (!row) return null

    return DrizzleInstitutionMapper.toDomain(row)
  }

  async findBySlug(slug: string): Promise<Institution | null> {
    const [row] = await this.db.select().from(institutions).where(eq(institutions.slug, slug)).limit(1)

    if (!row) return null

    return DrizzleInstitutionMapper.toDomain(row)
  }

  async findAll(): Promise<Institution[]> {
    const rows = await this.db.select().from(institutions)

    return rows.map(DrizzleInstitutionMapper.toDomain)
  }

  async findManyActive(): Promise<Institution[]> {
    const rows = await this.db.select().from(institutions).where(eq(institutions.status, InstitutionStatus.ACTIVE))

    return rows.map(DrizzleInstitutionMapper.toDomain)
  }

  async create(institution: Institution): Promise<void> {
    await this.db.insert(institutions).values(DrizzleInstitutionMapper.toPersistence(institution))
  }

  async save(institution: Institution): Promise<void> {
    await this.db
      .update(institutions)
      .set(DrizzleInstitutionMapper.toPersistence(institution))
      .where(eq(institutions.id, institution.id.toString()))
  }
}
