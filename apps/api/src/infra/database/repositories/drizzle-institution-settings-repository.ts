import { eq } from 'drizzle-orm'
import type { InstitutionSettingsRepository } from '@/domain/institution/application/repositories/institution-settings-repository'
import type { InstitutionSettings } from '@/domain/institution/enterprise/entities/institution-settings'
import type { DrizzleClient } from '../drizzle/client'
import { DrizzleInstitutionSettingsMapper } from '../drizzle/mappers/drizzle-institution-settings-mapper'
import { institutionSettings } from '../drizzle/schemas'

export class DrizzleInstitutionSettingsRepository implements InstitutionSettingsRepository {
  constructor(readonly db: DrizzleClient) {}

  async findByInstitutionId(institutionId: string): Promise<InstitutionSettings | null> {
    const [row] = await this.db
      .select()
      .from(institutionSettings)
      .where(eq(institutionSettings.institutionId, institutionId))
      .limit(1)

    if (!row) return null

    return DrizzleInstitutionSettingsMapper.toDomain(row)
  }

  async create(settings: InstitutionSettings): Promise<void> {
    await this.db.insert(institutionSettings).values(DrizzleInstitutionSettingsMapper.toPersistence(settings))
  }

  async save(settings: InstitutionSettings): Promise<void> {
    await this.db
      .update(institutionSettings)
      .set(DrizzleInstitutionSettingsMapper.toPersistence(settings))
      .where(eq(institutionSettings.id, settings.id.toString()))
  }
}
