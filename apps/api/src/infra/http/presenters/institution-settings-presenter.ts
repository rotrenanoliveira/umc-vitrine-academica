import type { InstitutionSettings } from '@/domain/institution/enterprise/entities/institution-settings'

export class InstitutionSettingsPresenter {
  static toHTTP(settings: InstitutionSettings) {
    return {
      id: settings.id.toString(),
      institutionId: settings.institutionId.toString(),
      shouldProof: settings.shouldProof,
      shouldVerify: settings.shouldVerify,
      domain: settings.domain ?? null,
      updatedAt: settings.updatedAt?.toISOString() ?? null,
    }
  }
}
