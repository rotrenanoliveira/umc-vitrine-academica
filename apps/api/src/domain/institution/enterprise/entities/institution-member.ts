import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

export enum InstitutionMemberType {
  STUDENT = 'STUDENT',
  PROFESSOR = 'PROFESSOR',
  TEACHER = 'TEACHER',
  MANAGER = 'MANAGER',
  ADMINISTRATIVE_OFFICE = 'ADMINISTRATIVE_OFFICE',
}

export enum InstitutionMemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  FINISHED = 'FINISHED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export interface InstitutionMemberProps {
  userId: UniqueEntityId
  institutionId: UniqueEntityId
  type: InstitutionMemberType
  status: InstitutionMemberStatus
  createdAt: Date
  updatedAt?: Date | null
}

export class InstitutionMember extends Entity<InstitutionMemberProps> {
  get userId() {
    return this.props.userId
  }

  get institutionId() {
    return this.props.institutionId
  }

  get type() {
    return this.props.type
  }

  get status() {
    return this.props.status
  }

  set status(status: InstitutionMemberStatus) {
    this.props.status = status
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<InstitutionMemberProps, 'createdAt' | 'status'>, id?: UniqueEntityId) {
    return new InstitutionMember(
      {
        ...props,
        status: props.status ?? InstitutionMemberStatus.ACTIVE,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
