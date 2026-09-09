import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface InstitutionSettingsProps {
  institutionId: UniqueEntityId
  shouldProof: boolean
  shouldVerify: boolean
  domain?: string
  updatedAt?: Date | null
}

export class InstitutionSettings extends Entity<InstitutionSettingsProps> {
  get institutionId() {
    return this.props.institutionId
  }

  get shouldProof() {
    return this.props.shouldProof
  }

  set shouldProof(value: boolean) {
    this.props.shouldProof = value
    this.touch()
  }

  get shouldVerify() {
    return this.props.shouldVerify
  }

  set shouldVerify(value: boolean) {
    this.props.shouldVerify = value
    this.touch()
  }

  get domain() {
    return this.props.domain
  }

  set domain(value: string | undefined) {
    this.props.domain = value
    this.touch()
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: InstitutionSettingsProps, id?: UniqueEntityId) {
    return new InstitutionSettings(props, id)
  }
}
