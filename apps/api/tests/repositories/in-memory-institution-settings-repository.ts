import type { InstitutionSettingsRepository } from '@/domain/institution/application/repositories/institution-settings-repository'
import type { InstitutionSettings } from '@/domain/institution/enterprise/entities/institution-settings'

export class InMemoryInstitutionSettingsRepository implements InstitutionSettingsRepository {
  public items: InstitutionSettings[] = []

  async findByInstitutionId(institutionId: string) {
    return this.items.find((settings) => settings.institutionId.toString() === institutionId) ?? null
  }

  async create(settings: InstitutionSettings) {
    this.items.push(settings)
  }

  async save(settings: InstitutionSettings) {
    const index = this.items.findIndex((item) => item.institutionId.toString() === settings.institutionId.toString())

    if (index < 0) {
      return
    }

    this.items[index] = settings
  }
}
