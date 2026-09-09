import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Slug } from '@/core/entities/value-objects/slug'
import type { Optional } from '@/core/types/optional'

export enum InstitutionType {
  UNIVERSITY = 'UNIVERSITY',
  COLLEGE = 'COLLEGE',
  CENTER = 'CENTER',
  TECHNICAL_COLLEGE = 'TECHNICAL_COLLEGE',
  OTHER = 'OTHER',
}

export enum InstitutionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  ARCHIVED = 'ARCHIVED',
}

export enum InstitutionOrigin {
  SEED = 'SEED',
  USER_REGISTRATION = 'USER_REGISTRATION',
  ADMIN = 'ADMIN',
}

export interface InstitutionProps {
  name: string
  slug: Slug
  type: InstitutionType
  status: InstitutionStatus
  origin: InstitutionOrigin
  description: string
  registerBy: UniqueEntityId
  createdAt: Date
  updatedAt?: Date | null
}

export class Institution extends Entity<InstitutionProps> {
  get name(): string {
    return this.props.name
  }

  set name(value: string) {
    this.props.name = value
    this.touch()
  }

  get slug(): Slug {
    return this.props.slug
  }

  set slug(value: Slug) {
    this.props.slug = value
    this.touch()
  }

  get type(): InstitutionType {
    return this.props.type
  }

  get status(): InstitutionStatus {
    return this.props.status
  }

  set status(value: InstitutionStatus) {
    this.props.status = value
    this.touch()
  }

  get origin(): InstitutionOrigin {
    return this.props.origin
  }

  get description(): string {
    return this.props.description
  }

  set description(value: string) {
    this.props.description = value
    this.touch()
  }

  get registerBy(): UniqueEntityId {
    return this.props.registerBy
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<InstitutionProps, 'createdAt' | 'status'>, id?: UniqueEntityId) {
    return new Institution(
      {
        ...props,
        status: props.status ?? InstitutionStatus.ACTIVE,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
