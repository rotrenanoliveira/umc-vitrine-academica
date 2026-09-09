import type { Institution } from '@/domain/institution/enterprise/entities/institution'

export class InstitutionPresenter {
  static toHTTP(institution: Institution) {
    return {
      id: institution.id.toString(),
      name: institution.name,
      slug: institution.slug.value,
      type: institution.type,
      status: institution.status,
      origin: institution.origin,
      description: institution.description,
      registerBy: institution.registerBy.toString(),
      createdAt: institution.createdAt.toISOString(),
      updatedAt: institution.updatedAt?.toISOString() ?? null,
    }
  }
}
