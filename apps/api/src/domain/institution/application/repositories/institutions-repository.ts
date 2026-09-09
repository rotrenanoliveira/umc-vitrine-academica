import type { Institution } from '../../enterprise/entities/institution'

export interface InstitutionsRepository {
  findById(id: string): Promise<Institution | null>
  findBySlug(slug: string): Promise<Institution | null>
  findAll(): Promise<Institution[]>
  findManyActive(): Promise<Institution[]>

  create(institution: Institution): Promise<void>
  save(institution: Institution): Promise<void>
}
