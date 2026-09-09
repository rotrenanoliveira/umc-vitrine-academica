import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InstitutionSettings } from '@/domain/institution/enterprise/entities/institution-settings'
import type { institutionSettings } from '../schemas/institution-settings'

type DrizzleInstitutionSettings = typeof institutionSettings.$inferSelect
type DrizzleInstitutionSettingsInsert = typeof institutionSettings.$inferInsert

export class DrizzleInstitutionSettingsMapper {
  static toDomain(row: DrizzleInstitutionSettings): InstitutionSettings {
    return InstitutionSettings.create(
      {
        institutionId: new UniqueEntityId(row.institutionId),
        shouldProof: row.shouldProof,
        shouldVerify: row.shouldVerify,
        domain: row.domain ?? undefined,
        updatedAt: row.updatedAt,
      },
      new UniqueEntityId(row.id),
    )
  }

  static toPersistence(settings: InstitutionSettings): DrizzleInstitutionSettingsInsert {
    return {
      id: settings.id.toString(),
      institutionId: settings.institutionId.toString(),
      shouldProof: settings.shouldProof,
      shouldVerify: settings.shouldVerify,
      domain: settings.domain,
      updatedAt: settings.updatedAt ?? undefined,
    }
  }
}
