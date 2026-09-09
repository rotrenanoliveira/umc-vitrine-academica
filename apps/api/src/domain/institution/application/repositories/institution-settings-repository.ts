import type { InstitutionSettings } from '../../enterprise/entities/institution-settings'

export interface InstitutionSettingsRepository {
  findByInstitutionId(institutionId: string): Promise<InstitutionSettings | null>

  create(settings: InstitutionSettings): Promise<void>
  save(settings: InstitutionSettings): Promise<void>
}
