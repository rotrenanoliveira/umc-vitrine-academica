import type { InstitutionsRepository } from '@/domain/institution/application/repositories/institutions-repository'
import { type Institution, InstitutionStatus } from '@/domain/institution/enterprise/entities/institution'

export class InMemoryInstitutionsRepository implements InstitutionsRepository {
  public items: Institution[] = []

  async findById(id: string) {
    return this.items.find((institution) => institution.id.toString() === id) ?? null
  }

  async findBySlug(slug: string) {
    return this.items.find((institution) => institution.slug.value === slug) ?? null
  }

  async findManyActive(): Promise<Institution[]> {
    return this.items.filter((institution) => institution.status === InstitutionStatus.ACTIVE)
  }

  async findAll() {
    return this.items
  }

  async findActive() {
    return this.items.filter((institution) => institution.status === InstitutionStatus.ACTIVE)
  }

  async create(institution: Institution) {
    this.items.push(institution)
  }

  async save(institution: Institution) {
    const index = this.items.findIndex((item) => item.id.toString() === institution.id.toString())
    if (index >= 0) this.items[index] = institution
  }
}
